import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const transporter = createTransport({  // ✅ Changed from nodemailer.createTransporter
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
/**
 * Send email using configured transporter
 * @param {Object} emailOptions - Email configuration
 * @param {string} emailOptions.to - Recipient email
 * @param {string} emailOptions.subject - Email subject
 * @param {string} emailOptions.html - HTML content
 * @param {string} emailOptions.text - Plain text content (optional)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Verify transporter configuration
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️  SMTP credentials not configured. Email will be logged instead.');
      console.log('📧 Email would be sent to:', to);
      console.log('📧 Subject:', subject);
      console.log('📧 Content:', html);
      return { success: true, messageId: `fake_${Date.now()}` };
    }

    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || 'Prime Sms',
        address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
      },
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject
    });

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send welcome email to new users
 * @param {Object} userData - User information
 */
export const sendWelcomeEmail = async ({ email, fullName, verificationToken }) => {
  const subject = 'Welcome to Prime Sms - Verify Your Account';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .features { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .feature { margin: 10px 0; padding: 10px; border-left: 3px solid #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to Prime Sms!</h1>
        </div>
        <div class="content">
          <h2>Hi ${fullName || 'there'}!</h2>
          <p>Thank you for joining our Prime Sms. You're now ready to send professional SMS messages to your customers with ease.</p>
          
          <p><strong>🎉 You've received 100 FREE trial credits to get started!</strong></p>
          
          <p>To complete your registration, please verify your email address:</p>
          <a href="${process.env.CLIENT_URL}/verify-email/${verificationToken}" class="button">
            Verify Email Address
          </a>
          
          <div class="features">
            <h3>🌟 What you can do:</h3>
            <div class="feature">📱 Send single SMS messages instantly</div>
            <div class="feature">📊 Upload CSV files for bulk messaging</div>
            <div class="feature">💾 Create and manage message templates</div>
            <div class="feature">⏰ Schedule messages for future delivery</div>
            <div class="feature">📈 Track delivery status and analytics</div>
            <div class="feature">🏷️ Use custom sender IDs (subject to approval)</div>
          </div>
          
          <p><strong>Need help?</strong> Our support team is here to assist you:</p>
          <ul>
            <li>📧 Email: ${process.env.SUPPORT_EMAIL || 'support@smsplatform.com'}</li>
            <li>💬 Live chat available in your dashboard</li>
            <li>📚 Check our knowledge base for guides</li>
          </ul>
          
          <p>Best regards,<br>The Prime Sms Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send payment receipt email
 * @param {Object} paymentData - Payment information
 */
export const sendPaymentReceiptEmail = async ({ email, fullName, amount, credits, bonusCredits, reference }) => {
  const subject = `Payment Receipt - ₦${amount} | Prime Sms`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .receipt { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Successful!</h1>
        </div>
        <div class="content">
          <h2>Hi ${fullName || 'Valued Customer'}!</h2>
          <p>Your payment has been processed successfully. Your SMS credits have been added to your account.</p>
          
          <div class="receipt">
            <h3>📋 Payment Details:</h3>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Amount Paid:</strong> ₦${amount}</p>
            <p><strong>Credits Added:</strong> ₦${credits}</p>
            ${bonusCredits > 0 ? `<p><strong>Bonus Credits:</strong> ₦${bonusCredits} 🎉</p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="amount">
            Total Credits: ₦${(parseFloat(credits) + parseFloat(bonusCredits || 0)).toFixed(2)}
          </div>
          
          <p>You can now use these credits to send SMS messages to your customers. Log in to your dashboard to get started!</p>
          
          <p>Thank you for choosing Prime Sms for your messaging needs.</p>
          
          <p>Best regards,<br>The Prime Sms Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send low balance alert email
 * @param {Object} userData - User information
 */
export const sendLowBalanceAlert = async ({ email, fullName, currentBalance }) => {
  const subject = '⚠️ Low Balance Alert - Prime Sms';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .balance { font-size: 20px; font-weight: bold; color: #f59e0b; text-align: center; margin: 20px 0; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Low Balance Alert</h1>
        </div>
        <div class="content">
          <h2>Hi ${fullName || 'there'}!</h2>
          <p>Your Prime Sms account balance is running low. You may want to top up to ensure uninterrupted service.</p>
          
          <div class="balance">
            Current Balance: ₦${currentBalance}
          </div>
          
          <p>To continue sending SMS messages, please add credits to your account:</p>
          <a href="${process.env.CLIENT_URL}/dashboard/wallet" class="button">
            Top Up Now
          </a>
          
          <p><strong>Why top up now?</strong></p>
          <ul>
            <li>🚫 Avoid service interruption</li>
            <li>💰 Take advantage of bonus credit offers</li>
            <li>📱 Keep your messaging campaigns running smoothly</li>
          </ul>
          
          <p>Need assistance? Contact our support team anytime.</p>
          
          <p>Best regards,<br>The Prime Sms Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
};