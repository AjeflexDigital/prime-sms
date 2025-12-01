import crypto from "crypto";
import dotenv from "dotenv";
import { query, transaction } from "../server/config/database.js";

dotenv.config();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Paystack-Signature"
  );

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Webhook received");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    // Get payload as string for signature verification
    const payload = JSON.stringify(req.body);

    // Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest("hex");

    const paystackSignature = req.headers["x-paystack-signature"];

    if (!paystackSignature) {
      console.error("No Paystack signature provided");
      return res.status(401).json({ error: "No signature provided" });
    }

    if (hash !== paystackSignature) {
      console.error("Invalid signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body;
    console.log("Webhook event:", event.event);

    // Handle successful charge
    if (event.event === "charge.success") {
      const { reference, amount, status, customer, metadata } = event.data;

      console.log("Payment successful:", {
        reference,
        amount: amount / 100,
        email: customer.email,
        status,
      });

      // Find payment record
      const paymentResult = await query(
        "SELECT * FROM payments WHERE reference = $1",
        [reference]
      );

      if (paymentResult.rows.length > 0) {
        const payment = paymentResult.rows[0];

        if (payment.status === "pending" && status === "success") {
          // Process the payment
          await transaction(async (client) => {
            // Update payment status
            await client.query(
              `UPDATE payments
               SET status = 'successful', gateway_response = $1, processed_at = CURRENT_TIMESTAMP
               WHERE reference = $2`,
              [JSON.stringify(event.data), reference]
            );

            // Add credits to user account
            const totalCredits =
              parseFloat(payment.credits_awarded) +
              parseFloat(payment.bonus_credits);

            await client.query(
              "UPDATE users SET credits = credits + $1 WHERE id = $2",
              [totalCredits, payment.user_id]
            );

            // Fetch updated balance
            const userResult = await client.query(
              "SELECT credits FROM users WHERE id = $1",
              [payment.user_id]
            );
            const updatedBalance = userResult.rows[0].credits;

            // Record wallet transaction
            await client.query(
              `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, payment_method, status)
               VALUES ($1, 'credit', $2, $3, $4, $5, 'paystack', 'completed')`,
              [
                payment.user_id,
                totalCredits,
                updatedBalance,
                `Payment received - ₦${payment.amount} + ₦${payment.bonus_credits} bonus`,
                reference,
              ]
            );

            // Add bonus transaction if applicable
            if (payment.bonus_credits > 0) {
              await client.query(
                `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, status)
                 VALUES ($1, 'bonus', $2, $3, $4, $5, 'completed')`,
                [
                  payment.user_id,
                  payment.bonus_credits,
                  updatedBalance,
                  `Bonus credits - ${(
                    (payment.bonus_credits / payment.amount) *
                    100
                  ).toFixed(1)}%`,
                  `BONUS_${reference}`,
                ]
              );
            }
          });

          console.log(
            "Payment processed successfully for reference:",
            reference
          );
        } else {
          console.log(
            "Payment already processed or not pending:",
            payment.status
          );
        }
      } else {
        console.log("Payment record not found for reference:", reference);
      }
    }

    return res.status(200).json({ status: "success", received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res
      .status(500)
      .json({ error: "Webhook processing failed", message: error.message });
  }
}
