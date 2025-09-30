import express from 'express';
import authMiddleware, { adminOnly } from '../middleware/auth.js';
import { query, transaction } from '../config/database.js';

const router = express.Router();

// Apply authentication and admin check to all routes
router.use(authMiddleware);
router.use(adminOnly);

// ============================================
// DASHBOARD & ANALYTICS
// ============================================

// Get admin dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'reseller') as total_resellers,
        (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
        (SELECT COUNT(*) FROM messages) as total_messages,
        (SELECT COUNT(*) FROM messages WHERE status = 'delivered') as delivered_messages,
        (SELECT COUNT(*) FROM messages WHERE created_at > NOW() - INTERVAL '24 hours') as messages_24h,
        (SELECT SUM(amount) FROM payments WHERE status = 'successful') as total_revenue,
        (SELECT SUM(amount) FROM payments WHERE status = 'successful' AND created_at > NOW() - INTERVAL '30 days') as revenue_30d,
        (SELECT SUM(credits) FROM users) as total_credits_pool,
        (SELECT COUNT(*) FROM sender_ids WHERE status = 'pending') as pending_sender_ids
    `);

    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// Get revenue chart data
router.get('/dashboard/revenue-chart', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let interval = period === '12m' ? '12 months' : '30 days';
    let dateFormat = period === '12m' ? 'YYYY-MM' : 'YYYY-MM-DD';

    const chartData = await query(`
      SELECT 
        TO_CHAR(created_at, $1) as date,
        SUM(amount) as revenue,
        COUNT(*) as transactions
      FROM payments
      WHERE status = 'successful'
        AND created_at > NOW() - INTERVAL $2
      GROUP BY TO_CHAR(created_at, $1)
      ORDER BY date
    `, [dateFormat, interval]);

    res.json({ success: true, data: chartData.rows });
  } catch (error) {
    console.error('Revenue chart error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch revenue data' });
  }
});

// Get SMS usage statistics
router.get('/dashboard/sms-stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(cost) as total_cost,
        network,
        DATE(created_at) as date
      FROM messages
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY status, network, DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({ success: true, data: stats.rows });
  } catch (error) {
    console.error('SMS stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch SMS stats' });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users with filters and pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (role) {
      whereConditions.push(`u.role = $${paramCount++}`);
      params.push(role);
    }
    if (status) {
      whereConditions.push(`u.status = $${paramCount++}`);
      params.push(status);
    }
    if (search) {
      whereConditions.push(`(u.email ILIKE $${paramCount} OR p.full_name ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const users = await query(`
      SELECT 
        u.id, u.email, u.role, u.status, u.credits, u.trial_credits,
        u.email_verified, u.last_login, u.created_at,
        p.full_name, p.phone, p.company, p.country,
        (SELECT COUNT(*) FROM messages WHERE user_id = u.id) as total_messages,
        (SELECT SUM(amount) FROM payments WHERE user_id = u.id AND status = 'successful') as total_spent
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...params, limit, offset]);

    const countResult = await query(`
      SELECT COUNT(*) FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: users.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await query(`
      SELECT 
        u.*, 
        p.full_name, p.phone, p.company, p.address, p.country, p.timezone, p.preferences,
        (SELECT COUNT(*) FROM messages WHERE user_id = u.id) as total_messages,
        (SELECT COUNT(*) FROM messages WHERE user_id = u.id AND status = 'delivered') as delivered_messages,
        (SELECT SUM(amount) FROM payments WHERE user_id = u.id AND status = 'successful') as total_spent
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE u.id = $1
    `, [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get recent activity
    const recentMessages = await query(`
      SELECT id, recipient, content, status, cost, created_at
      FROM messages
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [id]);

    const recentPayments = await query(`
      SELECT id, reference, amount, method, status, created_at
      FROM payments
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [id]);

    res.json({
      success: true,
      data: {
        user: user.rows[0],
        recentMessages: recentMessages.rows,
        recentPayments: recentPayments.rows
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user details' });
  }
});

// Update user status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'pending', 'banned'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await query(`
      UPDATE users 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [status, id]);

    res.json({ success: true, message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
});

// Add/deduct credits for user
router.post('/users/:id/credits', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, description } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ success: false, message: 'Amount and type are required' });
    }

    const result = await transaction(async (client) => {
      const user = await client.query('SELECT credits FROM users WHERE id = $1', [id]);
      if (user.rows.length === 0) {
        throw new Error('User not found');
      }

      const currentCredits = parseFloat(user.rows[0].credits);
      const creditAmount = parseFloat(amount);
      const newBalance = type === 'add' ? currentCredits + creditAmount : currentCredits - creditAmount;

      if (newBalance < 0) {
        throw new Error('Insufficient credits');
      }

      await client.query('UPDATE users SET credits = $1 WHERE id = $2', [newBalance, id]);

      await client.query(`
        INSERT INTO wallets (user_id, transaction_type, amount, balance, description)
        VALUES ($1, $2, $3, $4, $5)
      `, [id, type === 'add' ? 'credit' : 'debit', creditAmount, newBalance, description || `Admin ${type} credits`]);

      return newBalance;
    });

    res.json({
      success: true,
      message: 'Credits updated successfully',
      newBalance: result
    });
  } catch (error) {
    console.error('Update credits error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update credits' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await query('SELECT role FROM users WHERE id = $1', [id]);
    if (user.rows[0]?.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// ============================================
// SENDER ID MANAGEMENT
// ============================================

// Get all sender ID requests
router.get('/sender-ids', async (req, res) => {
  try {
    const { status } = req.query;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE s.status = $1';
      params = [status];
    }

    const senderIds = await query(`
      SELECT 
        s.*,
        u.email as user_email,
        p.full_name as user_name,
        admin.email as approved_by_email
      FROM sender_ids s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN users admin ON s.approved_by = admin.id
      ${whereClause}
      ORDER BY s.created_at DESC
    `, params);

    res.json({ success: true, data: senderIds.rows });
  } catch (error) {
    console.error('Get sender IDs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sender IDs' });
  }
});

// Approve/reject sender ID
router.patch('/sender-ids/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await query(`
      UPDATE sender_ids 
      SET status = $1, admin_notes = $2, approved_by = $3, approved_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [status, admin_notes, req.user.id, id]);

    res.json({ success: true, message: `Sender ID ${status} successfully` });
  } catch (error) {
    console.error('Update sender ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to update sender ID' });
  }
});

// ============================================
// PAYMENT MANAGEMENT
// ============================================

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, method } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (status) {
      whereConditions.push(`p.status = $${paramCount++}`);
      params.push(status);
    }
    if (method) {
      whereConditions.push(`p.method = $${paramCount++}`);
      params.push(method);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const payments = await query(`
      SELECT 
        p.*,
        u.email as user_email,
        prof.full_name as user_name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN profiles prof ON prof.user_id = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...params, limit, offset]);

    const countResult = await query(`
      SELECT COUNT(*) FROM payments p ${whereClause}
    `, params);

    res.json({
      success: true,
      data: payments.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Manually approve payment
router.post('/payments/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { credits_awarded, bonus_credits = 0 } = req.body;

    const result = await transaction(async (client) => {
      const payment = await client.query('SELECT * FROM payments WHERE id = $1', [id]);
      if (payment.rows.length === 0) {
        throw new Error('Payment not found');
      }

      const paymentData = payment.rows[0];
      if (paymentData.status === 'successful') {
        throw new Error('Payment already processed');
      }

      await client.query(`
        UPDATE payments 
        SET status = 'successful', 
            credits_awarded = $1, 
            bonus_credits = $2,
            processed_by = $3,
            processed_at = CURRENT_TIMESTAMP
        WHERE id = $4
      `, [credits_awarded, bonus_credits, req.user.id, id]);

      const totalCredits = parseFloat(credits_awarded) + parseFloat(bonus_credits);
      await client.query(`
        UPDATE users 
        SET credits = credits + $1
        WHERE id = $2
      `, [totalCredits, paymentData.user_id]);

      const userResult = await client.query('SELECT credits FROM users WHERE id = $1', [paymentData.user_id]);
      await client.query(`
        INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, payment_method)
        VALUES ($1, 'credit', $2, $3, $4, $5, $6)
      `, [
        paymentData.user_id,
        totalCredits,
        userResult.rows[0].credits,
        `Payment approved - Credits: ${credits_awarded}, Bonus: ${bonus_credits}`,
        paymentData.reference,
        paymentData.method
      ]);
    });

    res.json({ success: true, message: 'Payment approved and credits awarded' });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to approve payment' });
  }
});

// ============================================
// SMS MONITORING
// ============================================

// Get all SMS messages with filters
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, user_id, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (status) {
      whereConditions.push(`m.status = $${paramCount++}`);
      params.push(status);
    }
    if (user_id) {
      whereConditions.push(`m.user_id = $${paramCount++}`);
      params.push(user_id);
    }
    if (date_from) {
      whereConditions.push(`m.created_at >= $${paramCount++}`);
      params.push(date_from);
    }
    if (date_to) {
      whereConditions.push(`m.created_at <= $${paramCount++}`);
      params.push(date_to);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const messages = await query(`
      SELECT 
        m.*,
        u.email as user_email,
        p.full_name as user_name
      FROM messages m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN profiles p ON p.user_id = u.id
      ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...params, limit, offset]);

    res.json({ success: true, data: messages.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// ============================================
// PRICING MANAGEMENT
// ============================================

router.get('/pricing', async (req, res) => {
  try {
    const pricing = await query('SELECT * FROM pricing_tiers ORDER BY min_volume ASC');
    res.json({ success: true, data: pricing.rows });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing' });
  }
});

router.post('/pricing', async (req, res) => {
  try {
    const { min_volume, max_volume, price_per_unit, network, bonus_percentage } = req.body;

    const result = await query(`
      INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, network, bonus_percentage)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [min_volume, max_volume, price_per_unit, network || 'all', bonus_percentage || 0]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create pricing error:', error);
    res.status(500).json({ success: false, message: 'Failed to create pricing tier' });
  }
});

router.put('/pricing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { min_volume, max_volume, price_per_unit, network, bonus_percentage, is_active } = req.body;

    await query(`
      UPDATE pricing_tiers 
      SET min_volume = $1, max_volume = $2, price_per_unit = $3, 
          network = $4, bonus_percentage = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
    `, [min_volume, max_volume, price_per_unit, network, bonus_percentage, is_active, id]);

    res.json({ success: true, message: 'Pricing tier updated successfully' });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ success: false, message: 'Failed to update pricing tier' });
  }
});

router.delete('/pricing/:id', async (req, res) => {
  try {
    await query('DELETE FROM pricing_tiers WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Pricing tier deleted successfully' });
  } catch (error) {
    console.error('Delete pricing error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete pricing tier' });
  }
});

// ============================================
// SPAM WORD MANAGEMENT
// ============================================

router.get('/spam-words', async (req, res) => {
  try {
    const spamWords = await query('SELECT * FROM spam_words ORDER BY word ASC');
    res.json({ success: true, data: spamWords.rows });
  } catch (error) {
    console.error('Get spam words error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch spam words' });
  }
});

router.post('/spam-words', async (req, res) => {
  try {
    const { word, severity, action, replacement } = req.body;

    const result = await query(`
      INSERT INTO spam_words (word, severity, action, replacement, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [word, severity || 'medium', action || 'block', replacement, req.user.id]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Add spam word error:', error);
    res.status(500).json({ success: false, message: 'Failed to add spam word' });
  }
});

router.delete('/spam-words/:id', async (req, res) => {
  try {
    await query('DELETE FROM spam_words WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Spam word deleted successfully' });
  } catch (error) {
    console.error('Delete spam word error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete spam word' });
  }
});

// ============================================
// SYSTEM SETTINGS
// ============================================

router.get('/settings', async (req, res) => {
  try {
    const settings = await query('SELECT * FROM system_settings ORDER BY setting_key ASC');
    res.json({ success: true, data: settings.rows });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

router.put('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { setting_value } = req.body;

    await query(`
      UPDATE system_settings 
      SET setting_value = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = $3
    `, [setting_value, req.user.id, key]);

    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ success: false, message: 'Failed to update setting' });
  }
});

// ============================================
// RESELLER MANAGEMENT
// ============================================

router.get('/resellers', async (req, res) => {
  try {
    const resellers = await query(`
      SELECT 
        r.*,
        u.email,
        p.full_name,
        (SELECT COUNT(*) FROM users WHERE reseller_id = r.user_id) as total_clients
      FROM resellers r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN profiles p ON p.user_id = u.id
      ORDER BY r.created_at DESC
    `);

    res.json({ success: true, data: resellers.rows });
  } catch (error) {
    console.error('Get resellers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resellers' });
  }
});

router.patch('/resellers/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await query(`
      UPDATE resellers 
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [is_active, id]);

    res.json({ success: true, message: 'Reseller status updated successfully' });
  } catch (error) {
    console.error('Update reseller status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update reseller status' });
  }
});

// ============================================
// REPORTS & EXPORTS
// ============================================

router.get('/export/users', async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        u.email, u.role, u.status, u.credits, u.created_at,
        p.full_name, p.phone, p.company
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      ORDER BY u.created_at DESC
    `);

    const csv = [
      'Email,Full Name,Phone,Company,Role,Status,Credits,Created At',
      ...users.rows.map(u => 
        `${u.email},"${u.full_name || ''}","${u.phone || ''}","${u.company || ''}",${u.role},${u.status},${u.credits},${u.created_at}`
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ success: false, message: 'Failed to export users' });
  }
});

export default router;