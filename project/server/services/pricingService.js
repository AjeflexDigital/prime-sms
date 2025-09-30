import { query } from '../config/database.js';

/**
 * Calculate message cost based on length and pricing tiers
 * @param {string} message - Message content
 * @param {string} phoneNumber - Recipient phone number
 * @returns {Object} - Cost calculation result
 */
export const calculateMessageCost = async (message, phoneNumber) => {
  try {
    // Calculate message pages (160 characters per page for GSM 7-bit)
    const pages = calculateMessagePages(message);
    
    // Extract country/network info from phone number
    const network = extractNetworkInfo(phoneNumber);
    
    // Get applicable pricing tier
    const pricePerUnit = await getPricePerUnit(pages, network);
    
    // Calculate total cost
    const cost = parseFloat((pages * pricePerUnit).toFixed(4));

    return {
      pages,
      pricePerUnit,
      cost,
      network: network.name,
      country: network.country
    };

  } catch (error) {
    console.error('Price calculation error:', error);
    // Return default pricing if calculation fails
    return {
      pages: calculateMessagePages(message),
      pricePerUnit: 3.50, // Default rate
      cost: parseFloat((calculateMessagePages(message) * 3.50).toFixed(4)),
      network: 'UNKNOWN',
      country: 'NG'
    };
  }
};

/**
 * Calculate number of message pages/units
 * @param {string} message - Message content
 * @returns {number} - Number of pages
 */
const calculateMessagePages = (message) => {
  if (!message) return 0;

  const length = message.length;
  
  // Check if message contains Unicode characters
  const hasUnicode = /[^\x00-\x7F]/.test(message);
  
  if (hasUnicode) {
    // Unicode messages: 70 characters per page
    return Math.ceil(length / 70);
  } else {
    // GSM 7-bit: 160 characters per page for single SMS
    // For concatenated SMS: 153 characters per page (due to UDH)
    if (length <= 160) {
      return 1;
    } else {
      return Math.ceil(length / 153);
    }
  }
};

/**
 * Extract network and country information from phone number
 * @param {string} phoneNumber - Phone number
 * @returns {Object} - Network information
 */
const extractNetworkInfo = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Default to Nigeria
  let country = 'NG';
  let name = 'UNKNOWN';
  
  if (cleaned.startsWith('234')) {
    // Nigerian networks
    const prefix = cleaned.substr(3, 3);
    const networks = {
      '803': 'MTN', '806': 'MTN', '813': 'MTN', '816': 'MTN', 
      '903': 'MTN', '906': 'MTN', '703': 'MTN', '706': 'MTN',
      '802': 'AIRTEL', '808': 'AIRTEL', '812': 'AIRTEL', '901': 'AIRTEL',
      '805': 'GLO', '807': 'GLO', '815': 'GLO', '811': 'GLO',
      '809': 'ETISALAT', '817': 'ETISALAT', '818': 'ETISALAT'
    };
    
    name = networks[prefix] || 'OTHER_NG';
  } else {
    // Other countries - basic detection
    if (cleaned.startsWith('233')) { country = 'GH'; name = 'GHANA'; }
    else if (cleaned.startsWith('254')) { country = 'KE'; name = 'KENYA'; }
    else if (cleaned.startsWith('256')) { country = 'UG'; name = 'UGANDA'; }
    else if (cleaned.startsWith('255')) { country = 'TZ'; name = 'TANZANIA'; }
  }
  
  return { name, country };
};

/**
 * Get price per unit based on volume and network
 * @param {number} volume - Number of message units
 * @param {Object} network - Network information
 * @returns {number} - Price per unit
 */
const getPricePerUnit = async (volume, network) => {
  try {
    // Get pricing tiers for the specific network/country
    const result = await query(
      `SELECT price_per_unit, bonus_percentage
       FROM pricing_tiers 
       WHERE (network = $1 OR network = 'all') 
         AND (country_code = $2 OR country_code = 'all')
         AND min_volume <= $3 
         AND (max_volume IS NULL OR max_volume >= $3)
         AND is_active = true
       ORDER BY network DESC, country_code DESC, min_volume DESC
       LIMIT 1`,
      [network.name, network.country, volume]
    );

    if (result.rows.length > 0) {
      return parseFloat(result.rows[0].price_per_unit);
    }

    // Fallback: get default pricing
    const defaultResult = await query(
      `SELECT price_per_unit
       FROM pricing_tiers 
       WHERE network = 'all' AND country_code = 'all'
         AND min_volume <= $1 
         AND (max_volume IS NULL OR max_volume >= $1)
         AND is_active = true
       ORDER BY min_volume DESC
       LIMIT 1`,
      [volume]
    );

    return defaultResult.rows.length > 0 
      ? parseFloat(defaultResult.rows[0].price_per_unit)
      : 3.50; // Ultimate fallback

  } catch (error) {
    console.error('Get price per unit error:', error);
    return 3.50; // Default rate
  }
};

/**
 * Calculate bonus credits for payment amount
 * @param {number} paymentAmount - Payment amount
 * @param {number} volume - Number of credits being purchased
 * @returns {Object} - Bonus calculation result
 */
export const calculateBonusCredits = async (paymentAmount, volume) => {
  try {
    // Get applicable bonus rules
    const result = await query(
      `SELECT bonus_percentage
       FROM pricing_tiers 
       WHERE min_volume <= $1 
         AND (max_volume IS NULL OR max_volume >= $1)
         AND is_active = true
       ORDER BY min_volume DESC
       LIMIT 1`,
      [volume]
    );

    let bonusPercentage = 0;
    if (result.rows.length > 0) {
      bonusPercentage = parseFloat(result.rows[0].bonus_percentage);
    }

    const bonusAmount = (paymentAmount * bonusPercentage) / 100;
    
    return {
      bonusPercentage,
      bonusAmount: parseFloat(bonusAmount.toFixed(2)),
      totalCredits: paymentAmount + bonusAmount
    };

  } catch (error) {
    console.error('Bonus calculation error:', error);
    return {
      bonusPercentage: 0,
      bonusAmount: 0,
      totalCredits: paymentAmount
    };
  }
};

/**
 * Get current pricing tiers for display
 * @returns {Array} - Pricing tiers
 */
export const getPricingTiers = async () => {
  try {
    const result = await query(
      `SELECT min_volume, max_volume, price_per_unit, bonus_percentage, network, country_code
       FROM pricing_tiers 
       WHERE is_active = true 
       ORDER BY network, country_code, min_volume ASC`
    );

    return result.rows;
  } catch (error) {
    console.error('Get pricing tiers error:', error);
    return [];
  }
};

/**
 * Update pricing tier (admin function)
 * @param {string} tierId - Pricing tier ID
 * @param {Object} updates - Updated pricing data
 */
export const updatePricingTier = async (tierId, updates) => {
  try {
    const { minVolume, maxVolume, pricePerUnit, bonusPercentage, network, countryCode } = updates;

    const result = await query(
      `UPDATE pricing_tiers 
       SET min_volume = $1, max_volume = $2, price_per_unit = $3, 
           bonus_percentage = $4, network = $5, country_code = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [minVolume, maxVolume, pricePerUnit, bonusPercentage, network, countryCode, tierId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Update pricing tier error:', error);
    throw error;
  }
};

/**
 * Create new pricing tier (admin function)
 * @param {Object} tierData - Pricing tier data
 */
export const createPricingTier = async (tierData) => {
  try {
    const { minVolume, maxVolume, pricePerUnit, bonusPercentage, network, countryCode } = tierData;

    const result = await query(
      `INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, bonus_percentage, network, country_code)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [minVolume, maxVolume, pricePerUnit, bonusPercentage, network, countryCode]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Create pricing tier error:', error);
    throw error;
  }
};