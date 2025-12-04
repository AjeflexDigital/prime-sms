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

/**
 * Validate and format phone number
 * @param {string} phoneNumber - Raw phone number
 * @returns {string|null} - Formatted phone number or null if invalid
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Nigerian phone number patterns
  const patterns = [
    /^234[789][01]\d{8}$/, // +234 format
    /^0[789][01]\d{8}$/, // 0 format
    /^[789][01]\d{8}$/, // without country code
  ];

  for (const pattern of patterns) {
    if (pattern.test(cleaned)) {
      // Convert to international format
      if (cleaned.startsWith("234")) {
        return `+${cleaned}`;
      } else if (cleaned.startsWith("0")) {
        return `+234${cleaned.substr(1)}`;
      } else {
        return `+234${cleaned}`;
      }
    }
  }

  // Try other African countries (basic validation)
  if (/^\+\d{10,15}$/.test(`+${cleaned}`)) {
    return `+${cleaned}`;
  }

  return null;
};

// /**
//  * Extract network from phone number
//  * @param {string} phoneNumber - Phone number
//  * @returns {string} - Network name
//  */
// const extractNetwork = (phoneNumber) => {
//   const cleaned = phoneNumber.replace(/\D/g, '');

//   // Nigerian network prefixes
//   const networks = {
//     MTN: ['803', '806', '813', '816', '903', '906', '703', '706', '810', '814'],
//     AIRTEL: ['802', '808', '812', '901', '902', '907', '701', '708', '804'],
//     GLO: ['805', '807', '815', '811', '905', '705'],
//     ETISALAT: ['809', '817', '818', '908', '909', '818'],
//     NTEL: ['804']
//   };

//   for (const [network, prefixes] of Object.entries(networks)) {
//     for (const prefix of prefixes) {
//       if (cleaned.includes(prefix)) {
//         return network;
//       }
//     }
//   }

//   return 'UNKNOWN';
// };

// /**
//  * Generate unique message ID
//  * @returns {string} - Unique message ID
//  */
// const generateMessageId = () => {
//   return `msg_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
// };

// /**
//  * Check delivery status (webhook handler)
//  * @param {Object} data - Delivery report data
//  */
// export const handleDeliveryReport = async (data) => {
//   try {
//     const { id, status, networkCode, phoneNumber } = data;

//     // Update message status in database
//     await query(
//       `UPDATE messages
//        SET status = $1, delivered_at = CURRENT_TIMESTAMP, network = $2
//        WHERE message_id = $3`,
//       [status.toLowerCase(), networkCode, id]
//     );

//     console.log(`📬 Delivery report updated for ${phoneNumber}: ${status}`);

//   } catch (error) {
//     console.error('Delivery report handling error:', error);
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
//         headers: { 'apiKey': AT_API_KEY }
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Get delivery status error:', error);
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

console.log("🔧 SMS Service Config:");
console.log("- API Key:", AT_API_KEY ? "✅ Set" : "❌ Missing");
console.log("- Username:", AT_USERNAME);
console.log("- Base URL:", AT_BASE_URL);

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

    console.log(`📱 Sending SMS via Africa's Talking`);
    console.log(`   To: ${to}`);
    console.log(`   From: ${sanitizedFrom}`);
    console.log(`   Message: ${message.substring(0, 50)}...`);

    // Check if we're in production or sandbox mode
    const isProduction = process.env.NODE_ENV === "production";
    const apiUrl = isProduction
      ? "https://api.africastalking.com/version1/messaging"
      : `${AT_BASE_URL}/version1/messaging`;

    console.log(`   Using API: ${apiUrl}`);

    const requestData = {
      username: AT_USERNAME,
      to: to,
      message: message,
      from: sanitizedFrom,
    };

    console.log(`📤 Request data:`, requestData);

    const response = await axios.post(
      apiUrl,
      new URLSearchParams(requestData).toString(),
      {
        headers: {
          apiKey: AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    console.log(`📥 Africa's Talking Response:`, response.data);

    const result = response.data;

    if (result.SMSMessageData && result.SMSMessageData.Recipients) {
      const recipient = result.SMSMessageData.Recipients[0];

      console.log(`📊 Recipient status:`, recipient);

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

      console.log(`✅ SMS sent successfully:`, smsResult);

      return smsResult;
    } else {
      console.error(`❌ Invalid response structure:`, result);
      throw new Error("Invalid response from SMS gateway");
    }
  } catch (error) {
    console.error("❌ SMS sending error:", error);

    // Handle different error types
    if (error.response) {
      console.error("SMS API Error Response:", error.response.data);
      console.error("SMS API Error Status:", error.response.status);
      throw new Error(
        `SMS API Error: ${
          error.response.data.message || error.response.data || "Unknown error"
        }`
      );
    } else if (error.request) {
      console.error("SMS API No Response:", error.request);
      throw new Error(
        "SMS gateway is unreachable. Check your internet connection and API credentials."
      );
    } else {
      console.error("SMS Error:", error.message);
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

  // Nigerian network prefixes (using first 3 digits after country code)
  // For +234XXXXXXXXXXX, we check positions 3-5 (0-indexed)
  const prefix = cleaned.startsWith("234")
    ? cleaned.substring(3, 6)
    : cleaned.substring(1, 4);

  console.log(`🔍 Extracting network from ${phoneNumber}, prefix: ${prefix}`);

  // Nigerian network prefixes
  const networks = {
    MTN: ["803", "806", "813", "816", "903", "906", "703", "706", "810", "814"],
    AIRTEL: ["802", "808", "812", "901", "902", "907", "701", "708", "804"],
    GLO: ["805", "807", "815", "811", "905", "705"],
    ETISALAT: ["809", "817", "818", "908", "909"],
    NTEL: ["804"],
  };

  for (const [network, prefixes] of Object.entries(networks)) {
    if (prefixes.includes(prefix)) {
      console.log(`✅ Network detected: ${network}`);
      return network;
    }
  }

  console.log(`⚠️ Network unknown for prefix: ${prefix}`);
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

    // Import query function dynamically to avoid circular dependencies
    const { query } = await import("../config/database.js");

    // Update message status in database
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
