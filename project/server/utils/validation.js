/**
 * Validation utilities for production use
 */

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {Object} - Validation result
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Phone number is required' };
  }

  console.log(`📞 Validating phone: "${phone}"`);

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  console.log(`🧹 Cleaned: "${cleaned}"`);

  // Nigerian phone number patterns - FIXED REGEX
  const patterns = {
    // 234 + (7/8/9) + 9 more digits = 13 digits total
    international: /^234[789]\d{9}$/,
    // 0 + (7/8/9) + 9 more digits = 11 digits total
    local: /^0[789]\d{9}$/,
    // (7/8/9) + 9 more digits = 10 digits total
    noPrefix: /^[789]\d{9}$/
  };

  let formatted;

  if (patterns.international.test(cleaned)) {
    // Format: 234XXXXXXXXXX (13 digits)
    formatted = `+${cleaned}`;
    console.log(`✅ International format: ${formatted}`);
  } else if (patterns.local.test(cleaned)) {
    // Format: 0XXXXXXXXXX (11 digits)
    formatted = `+234${cleaned.substring(1)}`;
    console.log(`✅ Local format with 0: ${formatted}`);
  } else if (patterns.noPrefix.test(cleaned)) {
    // Format: XXXXXXXXXX (10 digits)
    formatted = `+234${cleaned}`;
    console.log(`✅ Local format without 0: ${formatted}`);
  } else {
    console.log(`❌ No pattern matched. Length: ${cleaned.length}, First chars: ${cleaned.substring(0, 4)}`);
    return { 
      isValid: false, 
      message: `Invalid phone number format. Expected Nigerian mobile number (e.g., 08012345678). Received: ${phone}` 
    };
  }

  // Verify formatted number is exactly 14 characters (+234XXXXXXXXXX)
  if (formatted.length !== 14) {
    console.log(`❌ Formatted length wrong: ${formatted.length} (expected 14)`);
    return { 
      isValid: false, 
      message: 'Phone number format error after formatting' 
    };
  }

  console.log(`✅ Phone validated successfully: ${formatted}`);
  return { isValid: true, formatted, country: 'NG' };
};

/**
 * Validate sender ID
 * @param {string} senderId - Sender ID to validate
 * @returns {Object} - Validation result
 */
export const validateSenderId = (senderId) => {
  if (!senderId) {
    return { isValid: false, message: 'Sender ID is required' };
  }

  // Remove special characters and limit length
  const cleaned = senderId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 11);
  
  if (cleaned.length < 3) {
    return { isValid: false, message: 'Sender ID must be at least 3 characters' };
  }

  if (cleaned.length > 11) {
    return { isValid: false, message: 'Sender ID must not exceed 11 characters' };
  }

  return { isValid: true, cleaned };
};

/**
 * Validate message content
 * @param {string} message - Message content
 * @returns {Object} - Validation result
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, message: 'Message content is required' };
  }

  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, message: 'Message cannot be empty' };
  }

  if (trimmed.length > 1000) {
    return { isValid: false, message: 'Message too long (max 1000 characters)' };
  }

  return { isValid: true, cleaned: trimmed };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  return { isValid: true, cleaned: email.toLowerCase().trim() };
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

/**
 * Validate amount for payments
 * @param {number} amount - Amount to validate
 * @returns {Object} - Validation result
 */
export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Amount must be a valid number' };
  }

  if (numAmount < 100) {
    return { isValid: false, message: 'Minimum amount is ₦100' };
  }

  if (numAmount > 1000000) {
    return { isValid: false, message: 'Maximum amount is ₦1,000,000' };
  }

  return { isValid: true, amount: numAmount };
};