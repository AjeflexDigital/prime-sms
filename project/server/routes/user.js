import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';

const router = express.Router();

/**
 * GET /api/user/profile
 * Get user profile information
 */
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT u.id, u.email, u.role, u.status, u.credits, u.email_verified, u.created_at,
             p.full_name, p.phone, p.company, p.address, p.country, p.timezone
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    delete user.password; // Remove password from response

    res.json({ user });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', [
  body('fullName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('company').optional().trim(),
  body('address').optional().trim(),
  body('country').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { fullName, phone, company, address, country } = req.body;

    // Update or insert profile
    const result = await query(`
      INSERT INTO profiles (user_id, full_name, phone, company, address, country, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        company = EXCLUDED.company,
        address = EXCLUDED.address,
        country = EXCLUDED.country,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, fullName, phone, company, address, country]);

    res.json({
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

/**
 * GET /api/user/wallet
 * Get wallet balance and transaction history
 */
router.get('/wallet', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get current balance
    const balanceResult = await query(
      'SELECT credits FROM users WHERE id = $1',
      [userId]
    );

    // Get transaction history
    const transactionsResult = await query(`
      SELECT id, transaction_type, amount, balance, description, reference, 
             payment_method, status, created_at
      FROM wallets 
      WHERE user_id = $1 
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    // Get total transaction count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM wallets WHERE user_id = $1',
      [userId]
    );

    res.json({
      balance: balanceResult.rows[0]?.credits || 0,
      transactions: transactionsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Failed to retrieve wallet information' });
  }
});

/**
 * GET /api/user/templates
 * Get user's message templates
 */
router.get('/templates', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT id, name, content, category, variables, usage_count, is_active, created_at, updated_at
      FROM templates 
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `, [userId]);

    res.json({ templates: result.rows });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Failed to retrieve templates' });
  }
});

/**
 * POST /api/user/templates
 * Create new message template
 */
router.post('/templates', [
  body('name').trim().notEmpty(),
  body('content').trim().notEmpty(),
  body('category').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { name, content, category } = req.body;

    // Extract variables from content
    const variables = [...content.matchAll(/\{(\w+)\}/g)].map(match => match[1]);

    const result = await query(`
      INSERT INTO templates (user_id, name, content, category, variables)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, name, content, category || 'general', JSON.stringify(variables)]);

    res.status(201).json({
      message: 'Template created successfully',
      template: result.rows[0]
    });

  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Failed to create template' });
  }
});

/**
 * PUT /api/user/templates/:id
 * Update message template
 */
router.put('/templates/:id', [
  body('name').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  body('category').optional().trim()
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, content, category } = req.body;

    // Extract variables if content is provided
    let variables = null;
    if (content) {
      variables = [...content.matchAll(/\{(\w+)\}/g)].map(match => match[1]);
    }

    const updateFields = [];
    const params = [];
    let paramCount = 0;

    if (name) {
      updateFields.push(`name = $${++paramCount}`);
      params.push(name);
    }

    if (content) {
      updateFields.push(`content = $${++paramCount}`);
      params.push(content);
      updateFields.push(`variables = $${++paramCount}`);
      params.push(JSON.stringify(variables));
    }

    if (category) {
      updateFields.push(`category = $${++paramCount}`);
      params.push(category);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(userId, id);

    const result = await query(`
      UPDATE templates 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${++paramCount} AND id = $${++paramCount}
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({
      message: 'Template updated successfully',
      template: result.rows[0]
    });

  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ message: 'Failed to update template' });
  }
});

/**
 * DELETE /api/user/templates/:id
 * Delete message template
 */
router.delete('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      'UPDATE templates SET is_active = false WHERE user_id = $1 AND id = $2 RETURNING name',
      [userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ message: 'Template deleted successfully' });

  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Failed to delete template' });
  }
});

export default router;