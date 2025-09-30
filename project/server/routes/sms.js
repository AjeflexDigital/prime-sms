import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { body, validationResult } from 'express-validator';
import { query, transaction } from '../config/database.js';
import { sendSMS, validatePhoneNumber } from '../services/smsService.js';
import { checkSpamWords } from '../services/spamFilter.js';
import { calculateMessageCost } from '../services/pricingService.js';

const router = express.Router();

// Configure multer for CSV uploads
const upload = multer({
  dest: 'server/uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

/**
 * POST /api/sms/send-single
 * Send single SMS message
 */
router.post('/send-single', [
  body('recipient').isMobilePhone(),
  body('message').trim().isLength({ min: 1, max: 1000 }),
  body('senderId').optional().trim().isLength({ max: 11 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient, message, senderId } = req.body;
    const userId = req.user.id;

    // Validate phone number format
    const formattedPhone = validatePhoneNumber(recipient);
    if (!formattedPhone) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check for spam words
    const spamCheck = await checkSpamWords(message);
    if (spamCheck.isSpam) {
      return res.status(400).json({
        message: 'Message contains restricted content',
        blockedWords: spamCheck.blockedWords
      });
    }

    // Calculate message cost
    const { pages, cost } = await calculateMessageCost(message, formattedPhone);

    // Check user balance
    if (req.user.credits < cost) {
      return res.status(400).json({ 
        message: `Insufficient credits. Required: ₦${cost}, Available: ₦${req.user.credits}` 
      });
    }

    // Validate sender ID if provided
    let validatedSenderId = senderId || 'SMS_PLATFORM';
    if (senderId) {
      const senderIdResult = await query(
        'SELECT sender_id FROM sender_ids WHERE user_id = $1 AND sender_id = $2 AND status = $3',
        [userId, senderId, 'approved']
      );
      
      if (senderIdResult.rows.length === 0) {
        return res.status(400).json({ 
          message: 'Sender ID not approved. Please use an approved sender ID.' 
        });
      }
    }

    // Send SMS and update database in transaction
    const result = await transaction(async (client) => {
      // Deduct credits from user
      await client.query(
        'UPDATE users SET credits = credits - $1 WHERE id = $2',
        [cost, userId]
      );

      // Record wallet transaction
      await client.query(
        `INSERT INTO wallets (user_id, transaction_type, amount, balance, description)
         VALUES ($1, 'debit', $2, 
         (SELECT credits FROM users WHERE id = $1), 
         $3)`,
        [userId, cost, `SMS to ${formattedPhone}`]
      );

      // Send SMS via Africa's Talking
      const smsResult = await sendSMS({
        to: formattedPhone,
        message,
        from: validatedSenderId
      });

      // Log message in database
      const messageResult = await client.query(
        `INSERT INTO messages (user_id, recipient, content, sender_id, message_id, 
         status, pages, cost, network, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
         RETURNING id`,
        [
          userId, formattedPhone, message, validatedSenderId,
          smsResult.messageId, smsResult.status, pages, cost, smsResult.network
        ]
      );

      return {
        messageId: messageResult.rows[0].id,
        cost,
        pages,
        status: smsResult.status,
        balance: req.user.credits - cost
      };
    });

    res.json({
      message: 'SMS sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

/**
 * POST /api/sms/send-bulk
 * Send bulk SMS from CSV upload
 */
router.post('/send-bulk', upload.single('csvFile'), [
  body('message').trim().isLength({ min: 1, max: 1000 }),
  body('senderId').optional().trim().isLength({ max: 11 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }

    const { message, senderId } = req.body;
    const userId = req.user.id;

    // Check for spam words
    const spamCheck = await checkSpamWords(message);
    if (spamCheck.isSpam) {
      return res.status(400).json({
        message: 'Message contains restricted content',
        blockedWords: spamCheck.blockedWords
      });
    }

    // Parse CSV file
    const recipients = [];
    const csvPath = req.file.path;

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Extract phone number (flexible column names)
          const phone = row.phone || row.Phone || row.number || row.Number || row.mobile || row.Mobile;
          const name = row.name || row.Name || row.full_name || row.fullname || '';
          
          if (phone) {
            const formattedPhone = validatePhoneNumber(phone);
            if (formattedPhone) {
              recipients.push({
                phone: formattedPhone,
                name: name.trim(),
                personalizedMessage: message.replace('{name}', name || 'Customer')
              });
            }
          }
        })
        .on('end', async () => {
          try {
            // Clean up uploaded file
            fs.unlinkSync(csvPath);

            if (recipients.length === 0) {
              return res.status(400).json({ 
                message: 'No valid phone numbers found in CSV file' 
              });
            }

            // Calculate total cost
            let totalCost = 0;
            for (const recipient of recipients) {
              const { cost } = await calculateMessageCost(recipient.personalizedMessage, recipient.phone);
              totalCost += cost;
            }

            // Check user balance
            if (req.user.credits < totalCost) {
              return res.status(400).json({
                message: `Insufficient credits. Required: ₦${totalCost}, Available: ₦${req.user.credits}`,
                recipients: recipients.length,
                estimatedCost: totalCost
              });
            }

            // Process bulk SMS sending
            const results = await processBulkSMS(userId, recipients, senderId, totalCost);

            res.json({
              message: 'Bulk SMS processing initiated',
              totalRecipients: recipients.length,
              estimatedCost: totalCost,
              jobId: results.jobId
            });

            resolve();
          } catch (error) {
            console.error('Bulk SMS processing error:', error);
            res.status(500).json({ message: 'Failed to process bulk SMS' });
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('CSV parsing error:', error);
          fs.unlinkSync(csvPath);
          res.status(400).json({ message: 'Invalid CSV file format' });
          reject(error);
        });
    });

  } catch (error) {
    console.error('Bulk SMS error:', error);
    res.status(500).json({ message: 'Failed to process bulk SMS request' });
  }
});

/**
 * Process bulk SMS sending (background job)
 */
async function processBulkSMS(userId, recipients, senderId, totalCost) {
  const jobId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Process in background (don't await)
  setTimeout(async () => {
    try {
      await transaction(async (client) => {
        // Deduct total cost upfront
        await client.query(
          'UPDATE users SET credits = credits - $1 WHERE id = $2',
          [totalCost, userId]
        );

        let successCount = 0;
        let failedCount = 0;

        // Send messages in batches to avoid overwhelming the API
        const batchSize = 50;
        for (let i = 0; i < recipients.length; i += batchSize) {
          const batch = recipients.slice(i, i + batchSize);
          
          for (const recipient of batch) {
            try {
              const smsResult = await sendSMS({
                to: recipient.phone,
                message: recipient.personalizedMessage,
                from: senderId || 'SMS_PLATFORM'
              });

              // Log successful message
              await client.query(
                `INSERT INTO messages (user_id, recipient, content, sender_id, message_id, 
                 status, pages, cost, network, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
                [
                  userId, recipient.phone, recipient.personalizedMessage,
                  senderId || 'SMS_PLATFORM', smsResult.messageId, smsResult.status,
                  Math.ceil(recipient.personalizedMessage.length / 160),
                  await calculateMessageCost(recipient.personalizedMessage, recipient.phone).then(r => r.cost),
                  smsResult.network
                ]
              );

              successCount++;
            } catch (smsError) {
              console.error(`Failed to send SMS to ${recipient.phone}:`, smsError);
              
              // Log failed message
              await client.query(
                `INSERT INTO messages (user_id, recipient, content, sender_id, 
                 status, pages, cost, failed_reason, created_at)
                 VALUES ($1, $2, $3, $4, 'failed', $5, $6, $7, CURRENT_TIMESTAMP)`,
                [
                  userId, recipient.phone, recipient.personalizedMessage,
                  senderId || 'SMS_PLATFORM',
                  Math.ceil(recipient.personalizedMessage.length / 160),
                  await calculateMessageCost(recipient.personalizedMessage, recipient.phone).then(r => r.cost),
                  smsError.message
                ]
              );

              failedCount++;
            }
          }

          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Record wallet transaction
        await client.query(
          `INSERT INTO wallets (user_id, transaction_type, amount, balance, description)
           VALUES ($1, 'debit', $2, 
           (SELECT credits FROM users WHERE id = $1), 
           $3)`,
          [userId, totalCost, `Bulk SMS: ${successCount} sent, ${failedCount} failed`]
        );

        console.log(`Bulk SMS job ${jobId} completed: ${successCount} sent, ${failedCount} failed`);
      });
    } catch (error) {
      console.error(`Bulk SMS job ${jobId} failed:`, error);
    }
  }, 100);

  return { jobId };
}

/**
 * GET /api/sms/messages
 * Get user's SMS message history
 */
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, dateFrom, dateTo } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE user_id = $1';
    const params = [req.user.id];
    let paramCount = 1;

    if (status) {
      whereClause += ` AND status = $${++paramCount}`;
      params.push(status);
    }

    if (dateFrom) {
      whereClause += ` AND created_at >= $${++paramCount}`;
      params.push(dateFrom);
    }

    if (dateTo) {
      whereClause += ` AND created_at <= $${++paramCount}`;
      params.push(dateTo);
    }

    const messagesQuery = `
      SELECT id, recipient, content, sender_id, status, pages, cost, 
             network, sent_at, delivered_at, failed_reason, created_at
      FROM messages 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await query(messagesQuery, params);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM messages ${whereClause}`;
    const countResult = await query(countQuery, params.slice(0, paramCount - 2));

    res.json({
      messages: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to retrieve messages' });
  }
});

/**
 * GET /api/sms/stats
 * Get SMS usage statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get comprehensive stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN status = 'sent' OR status = 'delivered' THEN 1 END) as successful_messages,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_messages,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_messages,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_messages,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_messages,
        COALESCE(SUM(cost), 0) as total_spent,
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN cost ELSE 0 END), 0) as today_spent
      FROM messages 
      WHERE user_id = $1
    `;

    const result = await query(statsQuery, [userId]);
    const stats = result.rows[0];

    // Get network breakdown
    const networkQuery = `
      SELECT network, COUNT(*) as count, SUM(cost) as total_cost
      FROM messages 
      WHERE user_id = $1 AND network IS NOT NULL
      GROUP BY network
      ORDER BY count DESC
    `;

    const networkResult = await query(networkQuery, [userId]);

    res.json({
      ...stats,
      networks: networkResult.rows,
      success_rate: stats.total_messages > 0 
        ? ((stats.successful_messages / stats.total_messages) * 100).toFixed(2)
        : 0
    });

  } catch (error) {
    console.error('Get SMS stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve SMS statistics' });
  }
});

export default router;