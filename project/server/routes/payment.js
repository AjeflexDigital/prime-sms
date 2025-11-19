// import express from 'express';
// import crypto from 'crypto';
// import { body, validationResult } from 'express-validator';
// import { query, transaction } from '../config/database.js';
// import { calculateBonusCredits } from '../services/pricingService.js';
// import { sendPaymentReceiptEmail } from '../services/emailService.js';

// const router = express.Router();

// /**
//  * POST /api/payment/initialize
//  * Initialize Paystack payment
//  */
// router.post('/initialize', [
//   body('amount').isFloat({ min: 100 }),
//   body('email').isEmail()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { amount, email } = req.body;
//     const userId = req.user.id;

//     // Generate unique reference
//     const reference = `TXN_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;

//     // Calculate bonus credits
//     const bonusInfo = await calculateBonusCredits(amount, amount);

//     // Create payment record
//     await query(
//       `INSERT INTO payments (user_id, reference, amount, currency, method, status, credits_awarded, bonus_credits)
//        VALUES ($1, $2, $3, 'NGN', 'paystack', 'pending', $4, $5)`,
//       [userId, reference, amount, amount, bonusInfo.bonusAmount]
//     );

//     // In a real implementation, you would call Paystack API here
//     // For now, we'll simulate the response
//     const paystackResponse = {
//       status: true,
//       message: "Authorization URL created",
//       data: {
//         authorization_url: `https://checkout.paystack.com/${reference}`,
//         access_code: `access_code_${reference}`,
//         reference: reference
//       }
//     };

//     res.json({
//       success: true,
//       data: paystackResponse.data,
//       bonusInfo
//     });

//   } catch (error) {
//     console.error('Payment initialization error:', error);
//     res.status(500).json({ message: 'Failed to initialize payment' });
//   }
// });

// /**
//  * POST /api/payment/verify
//  * Verify Paystack payment
//  */
// router.post('/verify', [
//   body('reference').notEmpty()
// ], async (req, res) => {
//   try {
//     const { reference } = req.body;

//     // Get payment record
//     const paymentResult = await query(
//       'SELECT * FROM payments WHERE reference = $1',
//       [reference]
//     );

//     if (paymentResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     const payment = paymentResult.rows[0];

//     if (payment.status === 'successful') {
//       return res.json({ message: 'Payment already verified', payment });
//     }

//     // In a real implementation, verify with Paystack API
//     // For now, we'll simulate successful verification
//     const verificationResult = {
//       status: true,
//       data: {
//         status: 'success',
//         reference: reference,
//         amount: payment.amount * 100, // Paystack returns in kobo
//         gateway_response: 'Successful',
//         paid_at: new Date().toISOString()
//       }
//     };

//     if (verificationResult.status && verificationResult.data.status === 'success') {
//       // Process successful payment
//       await transaction(async (client) => {
//         // Update payment status
//         await client.query(
//           `UPDATE payments
//            SET status = 'successful', gateway_response = $1, processed_at = CURRENT_TIMESTAMP
//            WHERE reference = $2`,
//           [JSON.stringify(verificationResult.data), reference]
//         );

//         // Add credits to user account
//         const totalCredits = parseFloat(payment.credits_awarded) + parseFloat(payment.bonus_credits);

//         await client.query(
//           'UPDATE users SET credits = credits + $1 WHERE id = $2',
//           [totalCredits, payment.user_id]
//         );

//         // Record wallet transaction
//         await client.query(
//           `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, payment_method, status)
//            VALUES ($1, 'credit', $2,
//            (SELECT credits FROM users WHERE id = $1),
//            $3, $4, 'paystack', 'completed')`,
//           [
//             payment.user_id,
//             totalCredits,
//             `Payment received - ₦${payment.amount} + ₦${payment.bonus_credits} bonus`,
//             reference
//           ]
//         );

//         // Add bonus transaction if applicable
//         if (payment.bonus_credits > 0) {
//           await client.query(
//             `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, status)
//              VALUES ($1, 'bonus', $2,
//              (SELECT credits FROM users WHERE id = $1),
//              $3, $4, 'completed')`,
//             [
//               payment.user_id,
//               payment.bonus_credits,
//               `Bonus credits - ${((payment.bonus_credits / payment.amount) * 100).toFixed(1)}%`,
//               `BONUS_${reference}`
//             ]
//           );
//         }
//       });

//       // Get user info for email
//       const userResult = await query(
//         `SELECT u.email, p.full_name
//          FROM users u
//          LEFT JOIN profiles p ON u.id = p.user_id
//          WHERE u.id = $1`,
//         [payment.user_id]
//       );

//       const user = userResult.rows[0];

//       // Send receipt email
//       try {
//         await sendPaymentReceiptEmail({
//           email: user.email,
//           fullName: user.full_name,
//           amount: payment.amount,
//           credits: payment.credits_awarded,
//           bonusCredits: payment.bonus_credits,
//           reference: reference
//         });
//       } catch (emailError) {
//         console.error('Receipt email failed:', emailError);
//       }

//       res.json({
//         message: 'Payment verified successfully',
//         payment: {
//           ...payment,
//           status: 'successful',
//           totalCredits: parseFloat(payment.credits_awarded) + parseFloat(payment.bonus_credits)
//         }
//       });

//     } else {
//       // Payment failed
//       await query(
//         `UPDATE payments
//          SET status = 'failed', gateway_response = $1, processed_at = CURRENT_TIMESTAMP
//          WHERE reference = $2`,
//         [JSON.stringify(verificationResult.data), reference]
//       );

//       res.status(400).json({ message: 'Payment verification failed' });
//     }

//   } catch (error) {
//     console.error('Payment verification error:', error);
//     res.status(500).json({ message: 'Failed to verify payment' });
//   }
// });

// /**
//  * GET /api/payment/history
//  * Get user payment history
//  */
// router.get('/history', async (req, res) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;
//     const offset = (page - 1) * limit;
//     const userId = req.user.id;

//     const result = await query(
//       `SELECT id, reference, amount, currency, method, status, credits_awarded,
//               bonus_credits, created_at, processed_at
//        FROM payments
//        WHERE user_id = $1
//        ORDER BY created_at DESC
//        LIMIT $2 OFFSET $3`,
//       [userId, limit, offset]
//     );

//     // Get total count
//     const countResult = await query(
//       'SELECT COUNT(*) as total FROM payments WHERE user_id = $1',
//       [userId]
//     );

//     res.json({
//       payments: result.rows,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total: parseInt(countResult.rows[0].total),
//         pages: Math.ceil(countResult.rows[0].total / limit)
//       }
//     });

//   } catch (error) {
//     console.error('Payment history error:', error);
//     res.status(500).json({ message: 'Failed to retrieve payment history' });
//   }
// });

// /**
//  * POST /api/payment/webhook
//  * Handle Paystack webhook
//  */
// router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   try {
//     const hash = crypto
//       .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
//       .update(JSON.stringify(req.body))
//       .digest('hex');

//     if (hash !== req.headers['x-paystack-signature']) {
//       return res.status(400).json({ message: 'Invalid signature' });
//     }

//     const event = req.body;

//     if (event.event === 'charge.success') {
//       const { reference, amount, status } = event.data;

//       // Find payment record
//       const paymentResult = await query(
//         'SELECT * FROM payments WHERE reference = $1',
//         [reference]
//       );

//       if (paymentResult.rows.length > 0) {
//         const payment = paymentResult.rows[0];

//         if (payment.status === 'pending' && status === 'success') {
//           // Process the payment (similar to verify endpoint)
//           await transaction(async (client) => {
//             await client.query(
//               `UPDATE payments
//                SET status = 'successful', gateway_response = $1, processed_at = CURRENT_TIMESTAMP
//                WHERE reference = $2`,
//               [JSON.stringify(event.data), reference]
//             );

//             const totalCredits = parseFloat(payment.credits_awarded) + parseFloat(payment.bonus_credits);

//             await client.query(
//               'UPDATE users SET credits = credits + $1 WHERE id = $2',
//               [totalCredits, payment.user_id]
//             );

//             await client.query(
//               `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, payment_method, status)
//                VALUES ($1, 'credit', $2,
//                (SELECT credits FROM users WHERE id = $1),
//                $3, $4, 'paystack', 'completed')`,
//               [
//                 payment.user_id,
//                 totalCredits,
//                 `Payment received - ₦${payment.amount}`,
//                 reference
//               ]
//             );
//           });
//         }
//       }
//     }

//     res.status(200).json({ message: 'Webhook processed' });

//   } catch (error) {
//     console.error('Webhook error:', error);
//     res.status(500).json({ message: 'Webhook processing failed' });
//   }
// });

// export default router;

import express from "express";
import crypto from "crypto";
import axios from "axios";
import { body, validationResult } from "express-validator";
import { query, transaction } from "../config/database.js";
import { calculateBonusCredits } from "../services/pricingService.js";
import {
  initializePaystackPayment,
  verifyPaystackPayment,
  validateWebhookSignature,
  processPaymentWebhook,
} from "../services/paymentService.js";

const router = express.Router();

// Paystack API configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// Configure axios for Paystack API
const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * POST /api/payment/initialize
 * Initialize Paystack payment
 */
router.post(
  "/initialize",
  [body("amount").isFloat({ min: 100 }), body("email").isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, email } = req.body;
      const userId = req.user.id;

      // Generate unique reference
      const reference = `TXN_${Date.now()}_${crypto
        .randomBytes(6)
        .toString("hex")}`;

      // Calculate bonus credits
      const bonusInfo = await calculateBonusCredits(amount, amount);

      // Create payment record
      await query(
        `INSERT INTO payments (user_id, reference, amount, currency, method, status, credits_awarded, bonus_credits)
       VALUES ($1, $2, $3, 'NGN', 'paystack', 'pending', $4, $5)`,
        [userId, reference, amount, amount, bonusInfo.bonusAmount]
      );

      // Initialize payment with Paystack
      const paymentResult = await initializePaystackPayment({
        email,
        amount,
        reference: reference,
        userId,
        callbackUrl: `${process.env.CLIENT_URL}/dashboard/wallet?payment=success`,
      });

      res.json({
        success: true,
        data: paymentResult.data,
        bonusInfo,
      });
    } catch (error) {
      console.error("Payment initialization error:", error);

      // Handle Paystack API errors
      if (error.response?.data) {
        return res.status(400).json({
          message:
            error.response.data.message || "Payment initialization failed",
          error: error.response.data,
        });
      }

      res.status(500).json({ message: "Failed to initialize payment" });
    }
  }
);

/**
 * POST /api/payment/verify
 * Verify Paystack payment
 */
router.post("/verify", [body("reference").notEmpty()], async (req, res) => {
  try {
    const { reference } = req.body;

    // Get payment record
    const paymentResult = await query(
      "SELECT * FROM payments WHERE reference = $1",
      [reference]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const payment = paymentResult.rows[0];

    if (payment.status === "successful") {
      return res.json({ message: "Payment already verified", payment });
    }

    // Verify payment with Paystack
    const verificationResult = await verifyPaystackPayment(reference);

    if (
      verificationResult.success &&
      verificationResult.data.status === "success"
    ) {
      // Process successful payment
      await transaction(async (client) => {
        // Update payment status
        await client.query(
          `UPDATE payments 
           SET status = 'successful', gateway_response = $1, processed_at = CURRENT_TIMESTAMP
           WHERE reference = $2`,
          [JSON.stringify(verificationResult.data), reference]
        );

        // Add credits to user account
        const totalCredits =
          parseFloat(payment.credits_awarded) +
          parseFloat(payment.bonus_credits);

        await client.query(
          "UPDATE users SET credits = credits + $1 WHERE id = $2",
          [totalCredits, payment.user_id]
        );

        // Record wallet transaction
        await client.query(
          `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, payment_method, status)
           VALUES ($1, 'credit', $2, 
           (SELECT credits FROM users WHERE id = $1), 
           $3, $4, 'paystack', 'completed')`,
          [
            payment.user_id,
            totalCredits,
            `Payment received - ₦${payment.amount} + ₦${payment.bonus_credits} bonus`,
            reference,
          ]
        );

        // Add bonus transaction if applicable
        if (payment.bonus_credits > 0) {
          await client.query(
            `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, status)
             VALUES ($1, 'bonus', $2, 
             (SELECT credits FROM users WHERE id = $1), 
             $3, $4, 'completed')`,
            [
              payment.user_id,
              payment.bonus_credits,
              `Bonus credits - ${(
                (payment.bonus_credits / payment.amount) *
                100
              ).toFixed(1)}%`,
              `BONUS_${reference}`,
            ]
          );
        }
      });

      // Get user info for email
      const userResult = await query(
        `SELECT u.email, p.full_name 
         FROM users u 
         LEFT JOIN profiles p ON u.id = p.user_id 
         WHERE u.id = $1`,
        [payment.user_id]
      );

      const user = userResult.rows[0];

      // Send receipt email
      try {
        await sendPaymentReceiptEmail({
          email: user.email,
          fullName: user.full_name,
          amount: payment.amount,
          credits: payment.credits_awarded,
          bonusCredits: payment.bonus_credits,
          reference: reference,
        });
      } catch (emailError) {
        console.error("Receipt email failed:", emailError);
      }

      res.json({
        message: "Payment verified successfully",
        payment: {
          ...payment,
          status: "successful",
          totalCredits:
            parseFloat(payment.credits_awarded) +
            parseFloat(payment.bonus_credits),
        },
      });
    } else {
      // Payment failed
      await query(
        `UPDATE payments 
         SET status = 'failed', gateway_response = $1, processed_at = CURRENT_TIMESTAMP
         WHERE reference = $2`,
        [JSON.stringify(verificationResult.data), reference]
      );

      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);

    // Handle Paystack API errors
    if (error.response?.data) {
      return res.status(400).json({
        message: error.response.data.message || "Payment verification failed",
        error: error.response.data,
      });
    }

    res.status(500).json({ message: "Failed to verify payment" });
  }
});

/**
 * GET /api/payment/history
 * Get user payment history
 */
router.get("/history", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const result = await query(
      `SELECT id, reference, amount, currency, method, status, credits_awarded, 
              bonus_credits, created_at, processed_at
       FROM payments 
       WHERE user_id = $1 
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total count
    const countResult = await query(
      "SELECT COUNT(*) as total FROM payments WHERE user_id = $1",
      [userId]
    );

    res.json({
      payments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Payment history error:", error);
    res.status(500).json({ message: "Failed to retrieve payment history" });
  }
});

/**
 * Webhook handler (exported so it can be mounted unprotected)
 * Uses raw body for correct Paystack signature verification
 */
export const webhookHandler = async (req, res) => {
  try {
    // When using express.raw the body is a Buffer. Convert to string for verification
    const raw =
      req.body && Buffer.isBuffer(req.body)
        ? req.body.toString("utf8")
        : JSON.stringify(req.body || {});
    const signature = req.get("x-paystack-signature");

    if (!validateWebhookSignature(raw, signature)) {
      console.warn("Invalid Paystack webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(raw);

    if (event.event === "charge.success") {
      await processPaymentWebhook(event.data);
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};

// keep router.post for mounted route (used when router is mounted directly)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

export default router;
