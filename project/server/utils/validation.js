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

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Nigerian phone number patterns
  const nigerianPatterns = [
    /^234[789][01]\d{8}$/, // +234 format
    /^0[789][01]\d{8}$/,   // 0 format
    /^[789][01]\d{8}$/     // without country code
  ];

  for (const pattern of nigerianPatterns) {
    if (pattern.test(cleaned)) {
      let formatted;
      if (cleaned.startsWith('234')) {
        formatted = `+${cleaned}`;
      } else if (cleaned.startsWith('0')) {
        formatted = `+234${cleaned.substr(1)}`;
      } else {
        formatted = `+234${cleaned}`;
      }
      return { isValid: true, formatted, country: 'NG' };
    }
  }

  // International format validation
  if (/^\+\d{10,15}$/.test(`+${cleaned}`)) {
    return { isValid: true, formatted: `+${cleaned}`, country: 'INTL' };
  }

  return { isValid: false, message: 'Invalid phone number format' };
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