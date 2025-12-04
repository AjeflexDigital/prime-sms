#!/usr/bin/env node
import dotenv from "dotenv";
import { transaction } from "../config/database.js";

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error("Usage: node server/scripts/assign_trial_to_user.js <email>");
  process.exit(1);
}

(async () => {
  try {
    await transaction(async (client) => {
      const userRes = await client.query(
        "SELECT id, credits, trial_credits FROM users WHERE email = $1",
        [email]
      );

      if (userRes.rows.length === 0) {
        throw new Error(`No user found for email: ${email}`);
      }

      const user = userRes.rows[0];
      const trial = parseFloat(user.trial_credits) || 0;

      if (trial <= 0) {
        console.log(`User ${email} has no trial credits to assign.`);
        return;
      }

      // Transfer trial_credits into credits, zero out trial_credits
      await client.query(
        "UPDATE users SET credits = COALESCE(credits, 0) + $1, trial_credits = 0 WHERE id = $2",
        [trial, user.id]
      );

      // Fetch updated balance
      const balRes = await client.query(
        "SELECT credits FROM users WHERE id = $1",
        [user.id]
      );
      const updatedBalance = balRes.rows[0].credits;

      // Record wallet transaction for audit
      const reference = `TRIAL_${Date.now()}`;
      await client.query(
        `INSERT INTO wallets (user_id, transaction_type, amount, balance, description, reference, status)
         VALUES ($1, 'bonus', $2, $3, $4, $5, 'completed')`,
        [
          user.id,
          trial,
          updatedBalance,
          `Assigned trial credits to ${email}`,
          reference,
        ]
      );

      console.log(
        `Assigned ${trial} trial credits to ${email}. New balance: ${updatedBalance}`
      );
    });
    process.exit(0);
  } catch (err) {
    console.error("Failed to assign trial credits:", err.message || err);
    process.exit(2);
  }
})();
