// // import axios from 'axios';
// // import crypto from 'crypto';

// // // Africa's Talking configuration
// // const AT_API_KEY = process.env.AFRICAS_TALKING_API_KEY || 'sandbox_api_key';
// // const AT_USERNAME = process.env.AFRICAS_TALKING_USERNAME || 'sandbox';
// // const AT_BASE_URL = process.env.AFRICAS_TALKING_URL || 'https://api.sandbox.africastalking.com';

// // /**
// //  * Send SMS via Africa's Talking API
// //  * @param {Object} params - SMS parameters
// //  * @param {string} params.to - Recipient phone number
// //  * @param {string} params.message - Message content
// //  * @param {string} params.from - Sender ID
// //  */
// // export const sendSMS = async ({ to, message, from = 'SMS_PLATFORM' }) => {
// //   try {
// //     console.log(` Sending SMS to ${to} from ${from}`);

// //     const response = await axios.post(
// //       `${AT_BASE_URL}/version1/messaging`,
// //       new URLSearchParams({
// //         username: AT_USERNAME,
// //         to: to,
// //         message: message,
// //         from: from
// //       }).toString(),
// //       {
// //         headers: {
// //           'apiKey': AT_API_KEY,
// //           'Content-Type': 'application/x-www-form-urlencoded',
// //           'Accept': 'application/json'
// //         }
// //       }
// //     );

// //     const result = response.data;

// //     if (result.SMSMessageData && result.SMSMessageData.Recipients) {
// //       const recipient = result.SMSMessageData.Recipients[0];

// //       // Determine message status
// //       let status = 'sent';
// //       if (recipient.status === 'Success') {
// //         status = 'sent';
// //       } else if (recipient.status === 'Queued') {
// //         status = 'queued';
// //       } else {
// //         status = 'failed';
// //       }

// //       return {
// //         messageId: recipient.messageId || generateMessageId(),
// //         status: status,
// //         network: extractNetwork(to),
// //         cost: recipient.cost || '0.00',
// //         statusCode: recipient.statusCode || 101,
// //         rawResponse: result
// //       };
// //     } else {
// //       throw new Error('Invalid response from SMS gateway');
// //     }

// //   } catch (error) {
// //     console.error('SMS sending error:', error);

// //     // Handle different error types
// //     if (error.response) {
// //       console.error('SMS API Error:', error.response.data);
// //       throw new Error(`SMS API Error: ${error.response.data.message || 'Unknown error'}`);
// //     } else if (error.request) {
// //       throw new Error('SMS gateway is unreachable');
// //     } else {
// //       throw new Error(`SMS Error: ${error.message}`);
// //     }
// //   }
// // };

// // /**
// //  * Validate and format phone number
// //  * @param {string} phoneNumber - Raw phone number
// //  * @returns {string|null} - Formatted phone number or null if invalid
// //  */
// // export const validatePhoneNumber = (phoneNumber) => {
// //   if (!phoneNumber) return null;

// //   // Remove all non-digit characters
// //   const cleaned = phoneNumber.replace(/\D/g, '');

// //   // Nigerian phone number patterns
// //   const patterns = [
// //     /^234[789][01]\d{8}$/, // +234 format
// //     /^0[789][01]\d{8}$/,   // 0 format
// //     /^[789][01]\d{8}$/     // without country code
// //   ];

// //   for (const pattern of patterns) {
// //     if (pattern.test(cleaned)) {
// //       // Convert to international format
// //       if (cleaned.startsWith('234')) {
// //         return `+${cleaned}`;
// //       } else if (cleaned.startsWith('0')) {
// //         return `+234${cleaned.substr(1)}`;
// //       } else {
// //         return `+234${cleaned}`;
// //       }
// //     }
// //   }

// //   // Try other African countries (basic validation)
// //   if (/^\+\d{10,15}$/.test(`+${cleaned}`)) {
// //     return `+${cleaned}`;
// //   }

// //   return null;
// // };

// // /**
// //  * Extract network from phone number
// //  * @param {string} phoneNumber - Phone number
// //  * @returns {string} - Network name
// //  */
// // const extractNetwork = (phoneNumber) => {
// //   const cleaned = phoneNumber.replace(/\D/g, '');

// //   // Nigerian network prefixes
// //   const networks = {
// //     MTN: ['803', '806', '813', '816', '903', '906', '703', '706', '810', '814'],
// //     AIRTEL: ['802', '808', '812', '901', '902', '907', '701', '708', '804'],
// //     GLO: ['805', '807', '815', '811', '905', '705'],
// //     ETISALAT: ['809', '817', '818', '908', '909', '818'],
// //     NTEL: ['804']
// //   };

// //   for (const [network, prefixes] of Object.entries(networks)) {
// //     for (const prefix of prefixes) {
// //       if (cleaned.includes(prefix)) {
// //         return network;
// //       }
// //     }
// //   }

// //   return 'UNKNOWN';
// // };

// // /**
// //  * Generate unique message ID
// //  * @returns {string} - Unique message ID
// //  */
// // const generateMessageId = () => {
// //   return `msg_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
// // };

// // /**
// //  * Check delivery status (webhook handler)
// //  * @param {Object} data - Delivery report data
// //  */
// // export const handleDeliveryReport = async (data) => {
// //   try {
// //     const { id, status, networkCode, phoneNumber } = data;

// //     // Update message status in database
// //     await query(
// //       `UPDATE messages
// //        SET status = $1, delivered_at = CURRENT_TIMESTAMP, network = $2
// //        WHERE message_id = $3`,
// //       [status.toLowerCase(), networkCode, id]
// //     );

// //     console.log(`📬 Delivery report updated for ${phoneNumber}: ${status}`);

// //   } catch (error) {
// //     console.error('Delivery report handling error:', error);
// //   }
// // };

// // /**
// //  * Get SMS delivery status
// //  * @param {string} messageId - Message ID from gateway
// //  */
// // export const getDeliveryStatus = async (messageId) => {
// //   try {
// //     const response = await axios.get(
// //       `${AT_BASE_URL}/version1/messaging/status`,
// //       {
// //         params: { username: AT_USERNAME, messageId },
// //         headers: { 'apiKey': AT_API_KEY }
// //       }
// //     );

// //     return response.data;
// //   } catch (error) {
// //     console.error('Get delivery status error:', error);
// //     return null;
// //   }
// // };

// import axios from 'axios';
// import crypto from 'crypto';

// // Africa's Talking configuration
// const AT_API_KEY = process.env.AFRICAS_TALKING_API_KEY || 'sandbox_api_key';
// const AT_USERNAME = process.env.AFRICAS_TALKING_USERNAME || 'sandbox';
// const AT_BASE_URL = process.env.AFRICAS_TALKING_URL || 'https://api.sandbox.africastalking.com';

// /**
//  * Send SMS via Africa's Talking API
//  * @param {Object} params - SMS parameters
//  * @param {string} params.to - Recipient phone number
//  * @param {string} params.message - Message content
//  * @param {string} params.from - Sender ID
//  */
// export const sendSMS = async ({ to, message, from = 'SMS_PLATFORM' }) => {
//   try {
//     // Validate and sanitize sender ID
//     const sanitizedFrom = from.replace(/[^a-zA-Z0-9]/g, '').substring(0, 11) || 'SMS_PLATFORM';

//     console.log(`📱 Sending SMS to ${to} from ${from}`);

//     // Check if we're in production or sandbox mode
//     const isProduction = process.env.NODE_ENV === 'production';
//     const apiUrl = isProduction
//       ? 'https://api.africastalking.com/version1/messaging'
//       : `${AT_BASE_URL}/version1/messaging`;

//     const response = await axios.post(
//       apiUrl,
//       new URLSearchParams({
//         username: AT_USERNAME,
//         to: to,
//         message: message,
//         from: sanitizedFrom
//       }).toString(),
//       {
//         headers: {
//           'apiKey': AT_API_KEY,
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     const result = response.data;

//     if (result.SMSMessageData && result.SMSMessageData.Recipients) {
//       const recipient = result.SMSMessageData.Recipients[0];

//       // Determine message status
//       let status = 'sent';
//       if (recipient.status === 'Success') {
//         status = 'sent';
//       } else if (recipient.status === 'Queued') {
//         status = 'queued';
//       } else {
//         status = 'failed';
//       }

//       return {
//         messageId: recipient.messageId || generateMessageId(),
//         status: status,
//         network: extractNetwork(to),
//         cost: parseFloat(recipient.cost || '0.00'),
//         statusCode: recipient.statusCode || 101,
//         rawResponse: result
//       };
//     } else {
//       throw new Error('Invalid response from SMS gateway');
//     }

//   } catch (error) {
//     console.error('SMS sending error:', error);

//     // Handle different error types
//     if (error.response) {
//       console.error('SMS API Error:', error.response.data);
//       throw new Error(`SMS API Error: ${error.response.data.message || 'Unknown error'}`);
//     } else if (error.request) {
//       throw new Error('SMS gateway is unreachable');
//     } else {
//       throw new Error(`SMS Error: ${error.message}`);
//     }
//   }
// };

// /**
//  * Validate and format phone number
//  * @param {string} phoneNumber - Raw phone number
//  * @returns {string|null} - Formatted phone number or null if invalid
//  */
// export const validatePhoneNumber = (phoneNumber) => {
//   if (!phoneNumber) {
//     console.error("validatePhoneNumber: No phone number provided");
//     return null;
//   }

//   // Remove all non-digit characters
//   const cleaned = phoneNumber.replace(/\D/g, "");

//   // Nigerian phone number patterns
//   const patterns = [
//     /^234[789][01]\d{8}$/, // +234 format
//     /^0[789][01]\d{8}$/, // 0 format
//     /^[789][01]\d{8}$/, // without country code
//   ];

//   for (const pattern of patterns) {
//     if (pattern.test(cleaned)) {
//       // Convert to international format
//       if (cleaned.startsWith("234")) {
//         return `+${cleaned}`;
//       } else if (cleaned.startsWith("0")) {
//         return `+234${cleaned.slice(1)}`;
//       } else {
//         return `+234${cleaned}`;
//       }
//     }
//   }

//   // Try other African countries (basic validation)
//   if (/^\d{10,15}$/.test(cleaned)) {
//     return `+${cleaned}`;
//   }

//   console.error(
//     `validatePhoneNumber: Failed for input '${phoneNumber}' (cleaned: '${cleaned}')`
//   );
//   return null;
// };

// import axios from "axios";
// import crypto from "crypto";

// // Africa's Talking configuration
// const AT_API_KEY = process.env.AFRICAS_TALKING_API_KEY || "sandbox_api_key";
// const AT_USERNAME = process.env.AFRICAS_TALKING_USERNAME || "sandbox";
// const AT_BASE_URL =
//   process.env.AFRICAS_TALKING_URL || "https://api.sandbox.africastalking.com";

// console.log("🔧 SMS Service Config:");
// console.log("- API Key:", AT_API_KEY ? "✅ Set" : "❌ Missing");
// console.log("- Username:", AT_USERNAME);
// console.log("- Base URL:", AT_BASE_URL);

// /**
//  * Send SMS via Africa's Talking API
//  * @param {Object} params - SMS parameters
//  * @param {string} params.to - Recipient phone number (must be in +234... format)
//  * @param {string} params.message - Message content
//  * @param {string} params.from - Sender ID
//  */
// export const sendSMS = async ({ to, message, from = "SMS_PLATFORM" }) => {
//   try {
//     // Validate and sanitize sender ID
//     const sanitizedFrom =
//       from.replace(/[^a-zA-Z0-9]/g, "").substring(0, 11) || "SMS_PLATFORM";

//     console.log(`📱 Sending SMS via Africa's Talking`);
//     console.log(`   To: ${to}`);
//     console.log(`   From: ${sanitizedFrom}`);
//     console.log(`   Message: ${message.substring(0, 50)}...`);

//     // Determine Africa's Talking mode: prefer explicit env var, fall back to base URL
//     const AT_MODE = (
//       process.env.AFRICAS_TALKING_MODE ||
//       (AT_BASE_URL.includes("sandbox") ? "sandbox" : "production")
//     ).toLowerCase();
//     const apiUrl =
//       AT_MODE === "production"
//         ? "https://api.africastalking.com/version1/messaging"
//         : `${AT_BASE_URL}/version1/messaging`;

//     console.log(`🔧 Africa's Talking mode: ${AT_MODE}`);

//     console.log(`   Using API: ${apiUrl}`);

//     const requestData = {
//       username: AT_USERNAME,
//       to: to,
//       message: message,
//       from: sanitizedFrom,
//     };

//     // Don't log secrets; show non-sensitive API info for debugging
//     console.log(`📤 Request data (no secrets):`, {
//       username: AT_USERNAME,
//       to: to,
//       from: sanitizedFrom,
//       messagePreview:
//         message.substring(0, 40) + (message.length > 40 ? "..." : ""),
//     });
//     console.log(
//       `   API Key present: ${AT_API_KEY ? "yes" : "no"} (length: ${
//         AT_API_KEY ? AT_API_KEY.length : 0
//       })`
//     );

//     const response = await axios.post(
//       apiUrl,
//       new URLSearchParams(requestData).toString(),
//       {
//         headers: {
//           apiKey: AT_API_KEY,
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//       }
//     );

//     console.log(`📥 Africa's Talking Response:`, response.data);

//     const result = response.data;

//     if (result.SMSMessageData && result.SMSMessageData.Recipients) {
//       const recipient = result.SMSMessageData.Recipients[0];

//       console.log(`📊 Recipient status:`, recipient);

//       // Determine message status
//       let status = "sent";
//       if (recipient.status === "Success") {
//         status = "sent";
//       } else if (recipient.status === "Queued") {
//         status = "queued";
//       } else {
//         status = "failed";
//       }

//       const smsResult = {
//         messageId: recipient.messageId || generateMessageId(),
//         status: status,
//         network: extractNetwork(to),
//         cost: parseFloat(recipient.cost || "0.00"),
//         statusCode: recipient.statusCode || 101,
//         rawResponse: result,
//       };

//       console.log(`✅ SMS sent successfully:`, smsResult);

//       return smsResult;
//     } else {
//       console.error(`❌ Invalid response structure:`, result);
//       throw new Error("Invalid response from SMS gateway");
//     }
//   } catch (error) {
//     console.error("❌ SMS sending error:", error);

//     // Handle different error types
//     if (error.response) {
//       console.error("SMS API Error Response:", error.response.data);
//       console.error("SMS API Error Status:", error.response.status);

//       // Provide a clearer message for authentication failures
//       if (error.response.status === 401) {
//         throw new Error(
//           "SMS API Error: Authentication failed (401). Check AFRICAS_TALKING_API_KEY, AFRICAS_TALKING_USERNAME, and AFRICAS_TALKING_MODE (sandbox|production)."
//         );
//       }

//       throw new Error(
//         `SMS API Error: ${
//           error.response.data.message || error.response.data || "Unknown error"
//         }`
//       );
//     } else if (error.request) {
//       console.error("SMS API No Response:", error.request);
//       throw new Error(
//         "SMS gateway is unreachable. Check your internet connection and API credentials."
//       );
//     } else {
//       console.error("SMS Error:", error.message);
//       throw new Error(`SMS Error: ${error.message}`);
//     }
//   }
// };

// /**
//  * Extract network from phone number
//  * @param {string} phoneNumber - Phone number
//  * @returns {string} - Network name
//  */
// const extractNetwork = (phoneNumber) => {
//   const cleaned = phoneNumber.replace(/\D/g, "");

//   // Nigerian network prefixes (using first 3 digits after country code)
//   // For +234XXXXXXXXXXX, we check positions 3-5 (0-indexed)
//   const prefix = cleaned.startsWith("234")
//     ? cleaned.substring(3, 6)
//     : cleaned.substring(1, 4);

//   console.log(`🔍 Extracting network from ${phoneNumber}, prefix: ${prefix}`);

//   // Nigerian network prefixes
//   const networks = {
//     MTN: ["803", "806", "813", "816", "903", "906", "703", "706", "810", "814"],
//     AIRTEL: ["802", "808", "812", "901", "902", "907", "701", "708", "804"],
//     GLO: ["805", "807", "815", "811", "905", "705"],
//     ETISALAT: ["809", "817", "818", "908", "909"],
//     NTEL: ["804"],
//   };

//   for (const [network, prefixes] of Object.entries(networks)) {
//     if (prefixes.includes(prefix)) {
//       console.log(`✅ Network detected: ${network}`);
//       return network;
//     }
//   }

//   console.log(`⚠️ Network unknown for prefix: ${prefix}`);
//   return "UNKNOWN";
// };

// /**
//  * Generate unique message ID
//  * @returns {string} - Unique message ID
//  */
// const generateMessageId = () => {
//   return `msg_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
// };

// /**
//  * Check delivery status (webhook handler)
//  * @param {Object} data - Delivery report data
//  */
// export const handleDeliveryReport = async (data) => {
//   try {
//     const { id, status, networkCode, phoneNumber } = data;

//     console.log(`📬 Delivery report received:`, {
//       id,
//       status,
//       networkCode,
//       phoneNumber,
//     });

//     // Import query function dynamically to avoid circular dependencies
//     const { query } = await import("../config/database.js");

//     // Update message status in database
//     await query(
//       `UPDATE messages 
//        SET status = $1, delivered_at = CURRENT_TIMESTAMP, network = $2
//        WHERE message_id = $3`,
//       [status.toLowerCase(), networkCode, id]
//     );

//     console.log(`✅ Delivery report updated for ${phoneNumber}: ${status}`);
//   } catch (error) {
//     console.error("❌ Delivery report handling error:", error);
//   }
// };

// /**
//  * Get SMS delivery status
//  * @param {string} messageId - Message ID from gateway
//  */
// export const getDeliveryStatus = async (messageId) => {
//   try {
//     const response = await axios.get(
//       `${AT_BASE_URL}/version1/messaging/status`,
//       {
//         params: { username: AT_USERNAME, messageId },
//         headers: { apiKey: AT_API_KEY },
//       }
//     );

//     console.log(`📊 Delivery status for ${messageId}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Get delivery status error:", error);
//     return null;
//   }
// };








import axios from "axios";
import crypto from "crypto";

// Africa's Talking configuration
const AT_API_KEY = process.env.AFRICAS_TALKING_API_KEY || "sandbox_api_key";
const AT_USERNAME = process.env.AFRICAS_TALKING_USERNAME || "sandbox";
const AT_BASE_URL =
  process.env.AFRICAS_TALKING_URL || "https://api.sandbox.africastalking.com";

// DETAILED STARTUP LOGGING
console.log("\n" + "=".repeat(60));
console.log("🔧 SMS SERVICE INITIALIZATION");
console.log("=".repeat(60));
console.log("Environment Variables Check:");
console.log("- AFRICAS_TALKING_API_KEY:", AT_API_KEY ? `✅ SET (${AT_API_KEY.length} chars, starts with: ${AT_API_KEY.substring(0, 10)}...)` : "❌ MISSING (using default)");
console.log("- AFRICAS_TALKING_USERNAME:", AT_USERNAME);
console.log("- AFRICAS_TALKING_URL:", AT_BASE_URL);
console.log("- AFRICAS_TALKING_MODE:", process.env.AFRICAS_TALKING_MODE || "not set");
console.log("- NODE_ENV:", process.env.NODE_ENV || "not set");

// VALIDATION WARNINGS
if (!process.env.AFRICAS_TALKING_API_KEY) {
  console.error("⚠️⚠️⚠️ CRITICAL: AFRICAS_TALKING_API_KEY environment variable is NOT SET!");
  console.error("⚠️⚠️⚠️ Using default value 'sandbox_api_key' which will cause 401 errors");
  console.error("⚠️⚠️⚠️ Set this in Vercel: Settings → Environment Variables");
}

if (AT_API_KEY === "sandbox_api_key") {
  console.error("⚠️⚠️⚠️ CRITICAL: API Key is still the default value!");
  console.error("⚠️⚠️⚠️ This will cause authentication failures");
}

if (!AT_API_KEY.startsWith("atsk_") && AT_API_KEY !== "sandbox_api_key") {
  console.error("⚠️ WARNING: API Key doesn't start with 'atsk_' - this may be invalid");
  console.error(`⚠️ Current key starts with: ${AT_API_KEY.substring(0, 5)}`);
}

console.log("=".repeat(60) + "\n");

/**
 * Send SMS via Africa's Talking API
 * @param {Object} params - SMS parameters
 * @param {string} params.to - Recipient phone number (must be in +234... format)
 * @param {string} params.message - Message content
 * @param {string} params.from - Sender ID
 */
export const sendSMS = async ({ to, message, from = "SMS_PLATFORM" }) => {
  try {
    // Validate and sanitize sender ID
    const sanitizedFrom =
      from.replace(/[^a-zA-Z0-9]/g, "").substring(0, 11) || "SMS_PLATFORM";

    console.log("\n" + "=".repeat(60));
    console.log("📱 SENDING SMS REQUEST");
    console.log("=".repeat(60));
    console.log("Request Parameters:");
    console.log("  • To:", to);
    console.log("  • From:", sanitizedFrom);
    console.log("  • Message Length:", message.length);
    console.log("  • Message Preview:", message.substring(0, 50) + (message.length > 50 ? "..." : ""));

    // Determine Africa's Talking mode
    const AT_MODE = (
      process.env.AFRICAS_TALKING_MODE ||
      (AT_BASE_URL.includes("sandbox") ? "sandbox" : "production")
    ).toLowerCase();
    
    const apiUrl =
      AT_MODE === "production"
        ? "https://api.africastalking.com/version1/messaging"
        : "https://api.sandbox.africastalking.com/version1/messaging";

    console.log("\nAPI Configuration:");
    console.log("  • Mode:", AT_MODE.toUpperCase());
    console.log("  • API URL:", apiUrl);
    console.log("  • Username:", AT_USERNAME);
    console.log("  • API Key Length:", AT_API_KEY ? AT_API_KEY.length : 0);
    console.log("  • API Key First 10 chars:", AT_API_KEY ? AT_API_KEY.substring(0, 10) + "..." : "NOT SET");

    const requestData = {
      username: AT_USERNAME,
      to: to,
      message: message,
      // from: sanitizedFrom,
    };

    console.log("\nRequest Body:");
    console.log("  • username:", requestData.username);
    console.log("  • to:", requestData.to);
    console.log("  • from:", requestData.from);
    console.log("  • message preview:", message.substring(0, 40) + "...");

    console.log("\nRequest Headers:");
    console.log("  • apiKey:", AT_API_KEY ? `${AT_API_KEY.substring(0, 15)}... (${AT_API_KEY.length} chars)` : "NOT SET");
    console.log("  • Content-Type: application/x-www-form-urlencoded");
    console.log("  • Accept: application/json");

    console.log("\n🚀 Making API request...");

    const response = await axios.post(
      apiUrl,
      new URLSearchParams(requestData).toString(),
      {
        headers: {
          apiKey: AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("\n✅ API Response Received:");
    console.log(JSON.stringify(response.data, null, 2));

    const result = response.data;

    if (result.SMSMessageData && result.SMSMessageData.Recipients) {
      const recipient = result.SMSMessageData.Recipients[0];

      console.log("\n📊 Recipient Status:");
      console.log("  • Status:", recipient.status);
      console.log("  • Message ID:", recipient.messageId);
      console.log("  • Status Code:", recipient.statusCode);
      console.log("  • Cost:", recipient.cost);

      // Determine message status
      let status = "sent";
      if (recipient.status === "Success") {
        status = "sent";
      } else if (recipient.status === "Queued") {
        status = "queued";
      } else {
        status = "failed";
      }

      const smsResult = {
        messageId: recipient.messageId || generateMessageId(),
        status: status,
        network: extractNetwork(to),
        cost: parseFloat(recipient.cost || "0.00"),
        statusCode: recipient.statusCode || 101,
        rawResponse: result,
      };

      console.log("\n✅ SMS SENT SUCCESSFULLY");
      console.log("=".repeat(60) + "\n");

      return smsResult;
    } else {
      console.error("\n❌ Invalid API Response Structure:");
      console.error(JSON.stringify(result, null, 2));
      throw new Error("Invalid response from SMS gateway");
    }
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ SMS SENDING FAILED");
    console.error("=".repeat(60));

    // Handle different error types with detailed logging
    if (error.response) {
      console.error("\n🔴 API ERROR RESPONSE:");
      console.error("  • Status Code:", error.response.status);
      console.error("  • Status Text:", error.response.statusText);
      console.error("  • Response Data:", JSON.stringify(error.response.data, null, 2));
      console.error("  • Response Headers:", JSON.stringify(error.response.headers, null, 2));

      // Specific handling for 401 errors
      if (error.response.status === 401) {
        console.error("\n❌ AUTHENTICATION FAILED (401)");
        console.error("This means your API credentials are invalid or incorrect.");
        console.error("\n🔍 DEBUG INFO:");
        console.error("  • API Key used:", AT_API_KEY ? `${AT_API_KEY.substring(0, 15)}... (${AT_API_KEY.length} chars)` : "NOT SET");
        console.error("  • Username used:", AT_USERNAME);
        console.error("  • API URL:", error.config?.url);
        console.error("  • Is API Key from environment?", !!process.env.AFRICAS_TALKING_API_KEY);
        
        console.error("\n💡 SOLUTIONS:");
        console.error("1. Check if AFRICAS_TALKING_API_KEY is set in Vercel");
        console.error("2. Verify the API key is correct in Africa's Talking dashboard");
        console.error("3. Make sure you're using the right key for sandbox/production");
        console.error("4. Ensure there are no extra spaces in the API key");
        console.error("5. Generate a new API key in Africa's Talking dashboard");
        
        throw new Error(
          `Authentication failed (401). API Key: ${AT_API_KEY ? 'SET but INVALID' : 'NOT SET'}. Username: ${AT_USERNAME}. Check your Africa's Talking credentials.`
        );
      }

      throw new Error(
        `SMS API Error (${error.response.status}): ${
          error.response.data.message || JSON.stringify(error.response.data) || "Unknown error"
        }`
      );
    } else if (error.request) {
      console.error("\n🔴 NO RESPONSE FROM API:");
      console.error("  • Request was made but no response received");
      console.error("  • This could be a network issue or API is down");
      console.error("  • Request:", error.request);
      throw new Error(
        "SMS gateway is unreachable. Check your internet connection and API status."
      );
    } else {
      console.error("\n🔴 REQUEST SETUP ERROR:");
      console.error("  • Error:", error.message);
      console.error("  • Stack:", error.stack);
      throw new Error(`SMS Error: ${error.message}`);
    }
  }
};

/**
 * Extract network from phone number
 * @param {string} phoneNumber - Phone number
 * @returns {string} - Network name
 */
const extractNetwork = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const prefix = cleaned.startsWith("234")
    ? cleaned.substring(3, 6)
    : cleaned.substring(1, 4);

  const networks = {
    MTN: ["803", "806", "813", "816", "903", "906", "703", "706", "810", "814"],
    AIRTEL: ["802", "808", "812", "901", "902", "907", "701", "708", "804"],
    GLO: ["805", "807", "815", "811", "905", "705"],
    ETISALAT: ["809", "817", "818", "908", "909"],
    NTEL: ["804"],
  };

  for (const [network, prefixes] of Object.entries(networks)) {
    if (prefixes.includes(prefix)) {
      return network;
    }
  }

  return "UNKNOWN";
};

/**
 * Generate unique message ID
 * @returns {string} - Unique message ID
 */
const generateMessageId = () => {
  return `msg_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
};

/**
 * Check delivery status (webhook handler)
 * @param {Object} data - Delivery report data
 */
export const handleDeliveryReport = async (data) => {
  try {
    const { id, status, networkCode, phoneNumber } = data;

    console.log(`📬 Delivery report received:`, {
      id,
      status,
      networkCode,
      phoneNumber,
    });

    const { query } = await import("../config/database.js");

    await query(
      `UPDATE messages 
       SET status = $1, delivered_at = CURRENT_TIMESTAMP, network = $2
       WHERE message_id = $3`,
      [status.toLowerCase(), networkCode, id]
    );

    console.log(`✅ Delivery report updated for ${phoneNumber}: ${status}`);
  } catch (error) {
    console.error("❌ Delivery report handling error:", error);
  }
};

/**
 * Get SMS delivery status
 * @param {string} messageId - Message ID from gateway
 */
export const getDeliveryStatus = async (messageId) => {
  try {
    const response = await axios.get(
      `${AT_BASE_URL}/version1/messaging/status`,
      {
        params: { username: AT_USERNAME, messageId },
        headers: { apiKey: AT_API_KEY },
      }
    );

    console.log(`📊 Delivery status for ${messageId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Get delivery status error:", error);
    return null;
  }
};
