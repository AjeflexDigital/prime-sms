import express from 'express';
import { body, validationResult } from 'express-validator';
import { query, transaction } from '../config/database.js';
import { resellerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply reseller or admin middleware to all routes
router.use(resellerOrAdmin);

/**
 * GET /api/reseller/dashboard
 * Get reseller dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const resellerId = req.user.id;

    // Get reseller's customers and their statistics
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT u.id) as total_customers,
        COUNT(DISTINCT CASE WHEN u.status = 'active' THEN u.id END) as active_customers,
        COUNT(DISTINCT m.id) as total_messages,
        COUNT(DISTINCT CASE WHEN m.status = 'delivered' THEN m.id END) as delivered_messages,
        COALESCE(SUM(m.cost), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN DATE(m.created_at) = CURRENT_DATE THEN m.cost ELSE 0 END), 0) as today_revenue
      FROM users u
      LEFT JOIN messages m ON u.id = m.user_id
      WHERE u.reseller_id = $1
    `;

    const result = await query(statsQuery, [resellerId]);
    const stats = result.rows[0];

    // Get recent customers
    const recentCustomersQuery = `
      SELECT u.id, u.email, u.status, u.credits, u.created_at,
             p.full_name, p.company
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.reseller_id = $1
      ORDER BY u.created_at DESC
      LIMIT 5
    `;

    const recentCustomers = await query(recentCustomersQuery, [resellerId]);

    // Get reseller settings
    const resellerQuery = `
      SELECT package, domain, brand_name, commission_rate, is_active
      FROM resellers
      WHERE user_id = $1
    `;

    const resellerInfo = await query(resellerQuery, [resellerId]);

    res.json({
      stats,
      recentCustomers: recentCustomers.rows,
      resellerInfo: resellerInfo.rows[0] || {}
    });

  } catch (error) {
    console.error('Reseller dashboard error:', error);
    res.status(500).json({ message: 'Failed to retrieve reseller dashboard' });
  }
});

/**
 * GET /api/reseller/customers
 * Get reseller's customers
 */
router.get('/customers', async (req, res) => {
  try {
    const resellerId = req.user.id;
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE u.reseller_id = $1';
    const params = [resellerId];
    let paramCount = 1;

    if (status && status !== 'all') {
      whereClause += ` AND u.status = $${++paramCount}`;
      params.push(status);
    }

    if (search) {
      whereClause += ` AND (u.email ILIKE $${++paramCount} OR p.full_name ILIKE $${++paramCount})`;
      params.push(`%${search}%`, `%${search}%`);
      paramCount++;
    }

    const customersQuery = `
      SELECT u.id, u.email, u.status, u.credits, u.email_verified, u.created_at, u.last_login,
             p.full_name, p.phone, p.company,
             COUNT(m.id) as message_count,
             COALESCE(SUM(m.cost), 0) as total_spent
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN messages m ON u.id = m.user_id
      ${whereClause}
      GROUP BY u.id, p.id
      ORDER BY u.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await query(customersQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      ${whereClause}
    `;

    const countResult = await query(countQuery, params.slice(0, paramCount - 2));

    res.json({
      customers: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get reseller customers error:', error);
    res.status(500).json({ message: 'Failed to retrieve customers' });
  }
});

/**
 * POST /api/reseller/customers
 * Create new customer under reseller
 */
router.post('/customers', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resellerId = req.user.id;
    const { email, password, fullName, phone, company } = req.body;

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer under reseller
    const result = await transaction(async (client) => {
      const userResult = await client.query(
        `INSERT INTO users (email, password, reseller_id, trial_credits, status)
         VALUES ($1, $2, $3, $4, 'active') RETURNING id`,
        [email, hashedPassword, resellerId, 50.00] // Reseller customers get 50 trial credits
      );

      const userId = userResult.rows[0].id;

      await client.query(
        `INSERT INTO profiles (user_id, full_name, phone, company)
         VALUES ($1, $2, $3, $4)`,
        [userId, fullName, phone, company]
      );

      // Add trial credits to wallet
      await client.query(
        `INSERT INTO wallets (user_id, transaction_type, amount, balance, description)
         VALUES ($1, 'bonus', 50.00, 50.00, 'Trial credits from reseller')`,
        [userId]
      );

      return { userId };
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customerId: result.userId
    });

  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Failed to create customer' });
  }
});

/**
 * GET /api/reseller/settings
 * Get reseller settings and branding
 */
router.get('/settings', async (req, res) => {
  try {
    const resellerId = req.user.id;

    const result = await query(`
      SELECT package, domain, logo_url, brand_name, brand_colors, settings, 
             commission_rate, is_active, expires_at
      FROM resellers
      WHERE user_id = $1
    `, [resellerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reseller settings not found' });
    }

    res.json({ settings: result.rows[0] });

  } catch (error) {
    console.error('Get reseller settings error:', error);
    res.status(500).json({ message: 'Failed to retrieve reseller settings' });
  }
});

/**
 * PUT /api/reseller/settings
 * Update reseller settings and branding
 */
router.put('/settings', [
  body('brandName').optional().trim(),
  body('domain').optional().isURL(),
  body('logoUrl').optional().isURL()
], async (req, res) => {
  try {
    const resellerId = req.user.id;
    const { brandName, domain, logoUrl, brandColors, settings } = req.body;

    const result = await query(`
      UPDATE resellers 
      SET brand_name = COALESCE($1, brand_name),
          domain = COALESCE($2, domain),
          logo_url = COALESCE($3, logo_url),
          brand_colors = COALESCE($4, brand_colors),
          settings = COALESCE($5, settings),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $6
      RETURNING *
    `, [brandName, domain, logoUrl, brandColors, settings, resellerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reseller not found' });
    }

    res.json({
      message: 'Settings updated successfully',
      settings: result.rows[0]
    });

  } catch (error) {
    console.error('Update reseller settings error:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

export default router;