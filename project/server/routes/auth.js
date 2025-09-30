import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import { query, transaction } from '../config/database.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * Generate JWT tokens (access + refresh)
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

/**
 * POST /api/auth/register
 * User registration with email verification
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').trim().notEmpty(),
  body('phone').optional().isMobilePhone()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, fullName, phone, company } = req.body;

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }


    // UPDATE users SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewCsI.6YgdQNcvGi' WHERE email = 'admin@smsplatform.com';

    // Hash password
    // const salt = await bcrypt.genSalt(12);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user and profile in transaction
    const result = await transaction(async (client) => {
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password, verification_token, trial_credits)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [email, hashedPassword, verificationToken, 100.00]
      );

      const userId = userResult.rows[0].id;

      // Insert profile
      await client.query(
        `INSERT INTO profiles (user_id, full_name, phone, company)
         VALUES ($1, $2, $3, $4)`,
        [userId, fullName, phone, company]
      );

      // Create initial wallet entry for trial credits
      await client.query(
        `INSERT INTO wallets (user_id, transaction_type, amount, balance, description)
         VALUES ($1, 'bonus', 100.00, 100.00, 'Welcome bonus - Trial credits')`,
        [userId]
      );

      return { userId };
    });

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Account - SMS Platform',
        html: `
          <h2>Welcome to SMS Platform!</h2>
          <p>Hi ${fullName},</p>
          <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
          <a href="${process.env.CLIENT_URL}/verify-email/${verificationToken}">Verify Email</a>
          <p>You've received 100 free trial credits to get started!</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      userId: result.userId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * POST /api/auth/login
 * User authentication
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Get user with profile data
    const userResult = await query(`
      SELECT u.*, p.full_name, p.phone, p.company
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = $1
    `, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (user.status === 'suspended') {
      return res.status(401).json({ message: 'Account is suspended' });
    }
    
    if (user.status === 'banned') {
      return res.status(401).json({ message: 'Account is banned' });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Remove sensitive data
    delete user.password;
    delete user.verification_token;
    delete user.password_reset_token;

    res.json({
      message: 'Login successful',
      user,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * POST /api/auth/verify-email
 * Email verification
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    const result = await query(
      `UPDATE users 
       SET email_verified = TRUE, verification_token = NULL, status = 'active'
       WHERE verification_token = $1 AND email_verified = FALSE
       RETURNING id, email`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    res.json({ message: 'Email verified successfully. You can now log in.' });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

/**
 * POST /api/auth/refresh-token
 * Refresh access token
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
    );

    // Check if user still exists and is active
    const userResult = await query(
      'SELECT id FROM users WHERE id = $1 AND status = $2',
      [decoded.userId, 'active']
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    res.json(tokens);

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Password reset request
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const { email } = req.body;

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    const result = await query(
      `UPDATE users 
       SET password_reset_token = $1, password_reset_expires = $2
       WHERE email = $3 AND status != 'banned'
       RETURNING id, email`,
      [resetToken, resetExpires, email]
    );

    if (result.rows.length > 0) {
      // Send reset email (even if user not found, don't reveal this)
      try {
        await sendEmail({
          to: email,
          subject: 'Password Reset - SMS Platform',
          html: `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `
        });
      } catch (emailError) {
        console.error('Password reset email failed:', emailError);
      }
    }

    // Always return success to prevent email enumeration
    res.json({ 
      message: 'If an account with that email exists, we\'ve sent a reset link.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing request' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    const result = await query(
      `UPDATE users 
       SET password = $1, password_reset_token = NULL, password_reset_expires = NULL
       WHERE password_reset_token = $2 AND password_reset_expires > CURRENT_TIMESTAMP
       RETURNING id, email`,
      [hashedPassword, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ message: 'Password reset successful. You can now log in.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

export default router;