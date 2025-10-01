import express from 'express';
import { body, validationResult } from 'express-validator';
import { query, transaction } from '../config/database.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply admin-only middleware to all routes
router.use(adminOnly);

/**
 * GET /api/admin/stats
 * Get platform statistics for admin dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    // Get comprehensive platform statistics
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'reseller') as total_resellers,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
        (SELECT COUNT(*) FROM messages) as total_messages,
        (SELECT COUNT(*) FROM messages WHERE DATE(created_at) = CURRENT_DATE) as today_messages,
        (SELECT COUNT(*) FROM messages WHERE status = 'delivered') as delivered_messages,
        (SELECT COUNT(*) FROM messages WHERE status = 'failed') as failed_messages,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'successful') as total_revenue,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'successful' AND DATE(created_at) = CURRENT_DATE) as today_revenue,
        (SELECT COALESCE(SUM(credits), 0) FROM users) as total_credits_distributed
    `;

    const result = await query(statsQuery);
    const stats = result.rows[0];

    // Calculate success rate
    const totalMessages = parseInt(stats.total_messages);
    const deliveredMessages = parseInt(stats.delivered_messages);
    stats.success_rate = totalMessages > 0 ? ((deliveredMessages / totalMessages) * 100).toFixed(2) : 0;

    // Get recent activity
    const recentUsersQuery = `
      SELECT u.id, u.email, p.full_name, u.created_at, u.status
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.role = 'user'
      ORDER BY u.created_at DESC
      LIMIT 5
    `;

    const recentUsers = await query(recentUsersQuery);

    const recentMessagesQuery = `
      SELECT m.id, m.recipient, m.content, m.status, m.cost, m.created_at,
             p.full_name as sender_name
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      ORDER BY m.created_at DESC
      LIMIT 10
    `;

    const recentMessages = await query(recentMessagesQuery);

    res.json({
      stats,
      recentUsers: recentUsers.rows,
      recentMessages: recentMessages.rows
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve admin statistics' });
  }
});

/**
 * GET /api/admin/users
 * Get all users with pagination and filtering
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (role && role !== 'all') {
      whereClause += ` AND u.role = $${++paramCount}`;
      params.push(role);
    }

    if (status && status !== 'all') {
      whereClause += ` AND u.status = $${++paramCount}`;
      params.push(status);
    }

    if (search) {
      whereClause += ` AND (u.email ILIKE $${++paramCount} OR p.full_name ILIKE $${++paramCount})`;
      params.push(`%${search}%`, `%${search}%`);
      paramCount++;
    }

    const usersQuery = `
      SELECT u.id, u.email, u.role, u.status, u.credits, u.email_verified,
             u.created_at, u.last_login,
             p.full_name, p.phone, p.company
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await query(usersQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      ${whereClause}
    `;

    const countResult = await query(countQuery, params.slice(0, paramCount - 2));

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

/**
 * PUT /api/admin/users/:userId/status
 * Update user status (activate, suspend, ban)
 */
router.put('/users/:userId/status', [
  body('status').isIn(['active', 'suspended', 'banned'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { status, reason } = req.body;

    const result = await query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING email',
      [status, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    await query(
      `INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
       VALUES ($1, $2, 'user', $3, $4)`,
      [req.user.id, `status_change_${status}`, userId, reason || `Status changed to ${status}`]
    );

    res.json({ message: `User status updated to ${status}` });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

/**
 * GET /api/admin/messages
 * Get all platform messages with filtering
 */
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, dateFrom, dateTo, userId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status && status !== 'all') {
      whereClause += ` AND m.status = $${++paramCount}`;
      params.push(status);
    }

    if (userId) {
      whereClause += ` AND m.user_id = $${++paramCount}`;
      params.push(userId);
    }

    if (dateFrom) {
      whereClause += ` AND m.created_at >= $${++paramCount}`;
      params.push(dateFrom);
    }

    if (dateTo) {
      whereClause += ` AND m.created_at <= $${++paramCount}`;
      params.push(dateTo);
    }

    const messagesQuery = `
      SELECT m.id, m.recipient, m.content, m.sender_id, m.status, m.pages, m.cost,
             m.network, m.created_at, m.sent_at, m.delivered_at,
             p.full_name as sender_name, u.email as sender_email
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await query(messagesQuery, params);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM messages m ${whereClause}`;
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
    console.error('Get admin messages error:', error);
    res.status(500).json({ message: 'Failed to retrieve messages' });
  }
});

/**
 * GET /api/admin/spam-words
 * Get all spam words
 */
router.get('/spam-words', async (req, res) => {
  try {
    const result = await query(
      `SELECT sw.*, u.email as created_by_email
       FROM spam_words sw
       LEFT JOIN users u ON sw.created_by = u.id
       ORDER BY sw.severity DESC, sw.word ASC`
    );

    res.json({ spamWords: result.rows });

  } catch (error) {
    console.error('Get spam words error:', error);
    res.status(500).json({ message: 'Failed to retrieve spam words' });
  }
});

/**
 * POST /api/admin/spam-words
 * Add new spam word
 */
router.post('/spam-words', [
  body('word').trim().notEmpty(),
  body('severity').isIn(['low', 'medium', 'high']),
  body('action').isIn(['block', 'flag', 'replace'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { word, severity, action, replacement } = req.body;

    const result = await query(
      `INSERT INTO spam_words (word, severity, action, replacement, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [word.toLowerCase(), severity, action, replacement, req.user.id]
    );

    res.status(201).json({
      message: 'Spam word added successfully',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error('Add spam word error:', error);
    res.status(500).json({ message: 'Failed to add spam word' });
  }
});

/**
 * DELETE /api/admin/spam-words/:id
 * Remove spam word
 */
router.delete('/spam-words/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM spam_words WHERE id = $1 RETURNING word',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Spam word not found' });
    }

    res.json({ message: 'Spam word removed successfully' });

  } catch (error) {
    console.error('Remove spam word error:', error);
    res.status(500).json({ message: 'Failed to remove spam word' });
  }
});

/**
 * GET /api/admin/pricing
 * Get pricing tiers
 */
router.get('/pricing', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM pricing_tiers ORDER BY min_volume ASC`
    );

    res.json({ pricingTiers: result.rows });

  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Failed to retrieve pricing tiers' });
  }
});

/**
 * PUT /api/admin/pricing/:id
 * Update pricing tier
 */
router.put('/pricing/:id', [
  body('minVolume').isInt({ min: 1 }),
  body('pricePerUnit').isFloat({ min: 0 }),
  body('bonusPercentage').isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { minVolume, maxVolume, pricePerUnit, bonusPercentage, network, countryCode } = req.body;

    const result = await query(
      `UPDATE pricing_tiers 
       SET min_volume = $1, max_volume = $2, price_per_unit = $3, 
           bonus_percentage = $4, network = $5, country_code = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [minVolume, maxVolume, pricePerUnit, bonusPercentage, network, countryCode, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pricing tier not found' });
    }

    res.json({
      message: 'Pricing tier updated successfully',
      pricingTier: result.rows[0]
    });

  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ message: 'Failed to update pricing tier' });
  }
});

export default router;