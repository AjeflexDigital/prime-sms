export const config = {
  api: {
    bodyParser: false, // we need the raw body for HMAC verification
  },
};

import {
  validateWebhookSignature,
  processPaymentWebhook,
} from "../../server/services/paymentService.js";

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // Only accept POST
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Collect raw body
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
    }

    const signature =
      req.headers["x-paystack-signature"] ||
      req.headers["x-paystack-signature".toLowerCase()];

    if (!signature) {
      console.warn("Webhook received without x-paystack-signature header");
      return res.status(400).json({ message: "Missing signature header" });
    }

    // Validate signature
    if (!validateWebhookSignature(raw, signature)) {
      console.warn("Invalid Paystack webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Parse event
    let event;
    try {
      event = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse webhook JSON:", err);
      return res.status(400).json({ message: "Invalid JSON payload" });
    }

    // Only process charge.success
    if (event.event === "charge.success") {
      await processPaymentWebhook(event.data);
      console.log(
        "✅ Webhook processed (charge.success)",
        event.data.reference
      );
    } else {
      console.log("Webhook event ignored:", event.event);
    }

    return res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
}
