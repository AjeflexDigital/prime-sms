import axios from 'axios';
import crypto from 'crypto';
import { query, transaction } from '../config/database.js';
import { sendPaymentReceiptEmail } from './emailService.js';

// Paystack API configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Configure axios for Paystack API
const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Initialize Paystack payment
 * @param {Object} paymentData - Payment initialization data
 */
export const initializePaystackPayment = async (paymentData) => {
  try {
    const { email, amount, reference, userId, callbackUrl } = paymentData;

    const response = await paystackAPI.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Convert to kobo
      reference,
      currency: 'NGN',
      callback_url: callbackUrl,
      metadata: {
        user_id: userId,
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: userId
          }
        ]
      }
    });

    return {
      success: true,
      data: response.data.data
    };

  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw new Error(error.response?.data?.message || 'Payment initialization failed');
  }
};

/**
 * Verify Paystack payment
 * @param {string} reference - Payment reference
 */
export const verifyPaystackPayment = async (reference) => {
  try {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

/**
 * Get all banks for bank transfer
 */
export const getPaystackBanks = async () => {
  try {
    const response = await paystackAPI.get('/bank');
    return {
      success: true,
      banks: response.data.data
    };
  } catch (error) {
    console.error('Get banks error:', error);
    return { success: false, banks: [] };
  }
};

/**
 * Create transfer recipient
 * @param {Object} recipientData - Recipient data
 */
export const createTransferRecipient = async (recipientData) => {
  try {
    const { name, account_number, bank_code, currency = 'NGN' } = recipientData;

    const response = await paystackAPI.post('/transferrecipient', {
      type: 'nuban',
      name,
      account_number,
      bank_code,
      currency
    });

    return {
      success: true,
      recipient: response.data.data
    };
  } catch (error) {
    console.error('Create recipient error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create transfer recipient');
  }
};

/**
 * Process refund
 * @param {Object} refundData - Refund data
 */
export const processRefund = async (refundData) => {
  try {
    const { transaction, amount, currency = 'NGN' } = refundData;

    const response = await paystackAPI.post('/refund', {
      transaction,
      amount: amount * 100, // Convert to kobo
      currency
    });

    return {
      success: true,
      refund: response.data.data
    };
  } catch (error) {
    console.error('Refund error:', error);
    throw new Error(error.response?.data?.message || 'Refund processing failed');
  }
};

/**
 * Validate webhook signature
 * @param {string} payload - Request body
 * @param {string} signature - Paystack signature
 */
export const validateWebhookSignature = (payload, signature) => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
};

/**
 * Process successful payment webhook
 * @param {Object} eventData - Webhook event data
 */
export const processPaymentWebhook = async (eventData) => {
  try {
    const { reference, amount, status, customer } = eventData;

    // Find payment record
    const paymentResult = await query(
      'SELECT * FROM payments WHERE reference = $1',
      [reference]
    );

    if (paymentResult.rows.length === 0) {
      throw new Error('Payment record not found');
    }

    const payment = paymentResult.rows[0];

    if (payment.status === 'pending' && status === 'success') {
      // Process the payment
      await transaction(async (client) => {
        // Update payment status
        await client.query(
          `UPDATE payments 
           SET status = 'successful', gateway_response = $1, processed_at = CURRENT_TIMESTAMP
           WHERE reference = $2`,
          [JSON.stringify(eventData), reference]
        );

        // Calculate total credits
        const totalCredits = parseFloat(payment.credits_awarded) + parseFloat(payment.bonus_credits || 0);
        
        // Add credits to user account
        await client.query(
          'UPDATE users SET credits = credits + $1 WHERE id = $2',
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
            `Payment received - ₦${payment.amount}`,
            reference
          ]
        );

        // Send receipt email
        const userResult = await client.query(
          `SELECT u.email, p.full_name 
           FROM users u 
           LEFT JOIN profiles p ON u.id = p.user_id 
           WHERE u.id = $1`,
          [payment.user_id]
        );

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          await sendPaymentReceiptEmail({
            email: user.email,
            fullName: user.full_name,
            amount: payment.amount,
            credits: payment.credits_awarded,
            bonusCredits: payment.bonus_credits,
            reference: reference
          });
        }
      });

      console.log(`✅ Payment processed successfully: ${reference}`);
      return { success: true };
    }

    return { success: false, message: 'Payment already processed or invalid status' };

  } catch (error) {
    console.error('Process payment webhook error:', error);
    throw error;
  }
};