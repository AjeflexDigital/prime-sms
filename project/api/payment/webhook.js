import crypto from 'crypto';
import { Readable } from 'stream';

// CRITICAL: Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Collect raw body from request stream
 */
async function getRawBody(req) {
  const chunks = [];
  
  // Convert req to readable stream if it isn't already
  const stream = req instanceof Readable ? req : Readable.from(req);
  
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Validate Paystack webhook signature
 */
function validateWebhookSignature(rawBody, signature) {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');
  
  return hash === signature;
}

/**
 * Process payment webhook
 */
async function processPaymentWebhook(data) {
  const { reference, status, amount, customer } = data;
  
  // Import your database query function
  const { query, transaction } = await import('../../server/config/database.js');
  
  if (status !== 'success') {
    console.log(`Payment ${reference} status: ${status}`);
    return;
  }

  // Get payment record
  const paymentResult = await query(
    'SELECT * FROM payments WHERE reference = $1',
    [reference]
  );

  if (paymentResult.rows.length === 0) {
    console.warn(`Payment not found for reference: ${reference}`);
    return;
  }

  const payment = paymentResult.rows[0];

  // Skip if already processed
  if (payment.status === 'successful') {
    console.log(`Payment ${reference} already processed`);
    return;
  }

  // Process payment in transaction
  await transaction(async (client) => {
    // Update payment status
    await client.query(
      `UPDATE payments 
       SET status = 'successful', 
           gateway_response = $1, 
           processed_at = CURRENT_TIMESTAMP
       WHERE reference = $2`,
      [JSON.stringify(data), reference]
    );

    // Calculate total credits
    const totalCredits =
      parseFloat(payment.credits_awarded) +
      parseFloat(payment.bonus_credits);

    // Update user credits
    await client.query(
      'UPDATE users SET credits = credits + $1 WHERE id = $2',
      [totalCredits, payment.user_id]
    );

    // Record wallet transaction
    await client.query(
      `INSERT INTO wallets (
        user_id, transaction_type, amount, balance, 
        description, reference, payment_method, status
      ) VALUES (
        $1, 'credit', $2, 
        (SELECT credits FROM users WHERE id = $1), 
        $3, $4, 'paystack', 'completed'
      )`,
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
        `INSERT INTO wallets (
          user_id, transaction_type, amount, balance, 
          description, reference, status
        ) VALUES (
          $1, 'bonus', $2, 
          (SELECT credits FROM users WHERE id = $1), 
          $3, $4, 'completed'
        )`,
        [
          payment.user_id,
          payment.bonus_credits,
          `Bonus credits - ${((payment.bonus_credits / payment.amount) * 100).toFixed(1)}%`,
          `BONUS_${reference}`,
        ]
      );
    }
  });

  console.log(`✅ Payment ${reference} processed: ${totalCredits} credits added`);
}

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
  // Set CORS headers for Paystack
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Paystack-Signature');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get raw body
    const rawBody = await getRawBody(req);

    // Get signature (check both cases)
    const signature =
      req.headers['x-paystack-signature'] ||
      req.headers['X-Paystack-Signature'];

    if (!signature) {
      console.warn('❌ Webhook received without signature header');
      console.log('Headers:', JSON.stringify(req.headers, null, 2));
      return res.status(400).json({ message: 'Missing signature header' });
    }

    // Validate signature
    const isValid = validateWebhookSignature(rawBody, signature);
    
    if (!isValid) {
      console.warn('❌ Invalid Paystack webhook signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Parse event
    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (err) {
      console.error('❌ Failed to parse webhook JSON:', err);
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    console.log(`📥 Webhook received: ${event.event} - ${event.data?.reference || 'N/A'}`);

    // Process charge.success events
    if (event.event === 'charge.success') {
      await processPaymentWebhook(event.data);
      console.log(`✅ Processed charge.success: ${event.data.reference}`);
    } else {
      console.log(`ℹ️  Ignoring event: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ message: 'Webhook received' });

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    // Still return 200 to prevent Paystack retries
    return res.status(200).json({ message: 'Webhook processed with errors' });
  }
}