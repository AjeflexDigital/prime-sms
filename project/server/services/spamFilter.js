import { query } from '../config/database.js';

/**
 * Check message content for spam words
 * @param {string} message - Message content to check
 * @returns {Object} - Spam check result
 */
export const checkSpamWords = async (message) => {
  try {
    // Get all active spam words from database
    const result = await query(
      'SELECT word, severity, action, replacement FROM spam_words ORDER BY severity DESC'
    );

    const spamWords = result.rows;
    const messageWords = message.toLowerCase().split(/\s+/);
    const blockedWords = [];
    const flaggedWords = [];
    let cleanedMessage = message;

    // Check each word in the message
    for (const spamWord of spamWords) {
      const pattern = new RegExp(`\\b${spamWord.word.toLowerCase()}\\b`, 'gi');
      
      if (pattern.test(message.toLowerCase())) {
        switch (spamWord.action) {
          case 'block':
            blockedWords.push({
              word: spamWord.word,
              severity: spamWord.severity
            });
            break;
            
          case 'flag':
            flaggedWords.push({
              word: spamWord.word,
              severity: spamWord.severity
            });
            break;
            
          case 'replace':
            if (spamWord.replacement) {
              cleanedMessage = cleanedMessage.replace(pattern, spamWord.replacement);
            }
            break;
        }
      }
    }

    return {
      isSpam: blockedWords.length > 0,
      blockedWords,
      flaggedWords,
      cleanedMessage,
      severity: blockedWords.length > 0 
        ? Math.max(...blockedWords.map(w => getSeverityLevel(w.severity)))
        : 0
    };

  } catch (error) {
    console.error('Spam filter error:', error);
    // If spam filter fails, allow the message but log the error
    return {
      isSpam: false,
      blockedWords: [],
      flaggedWords: [],
      cleanedMessage: message,
      severity: 0,
      error: 'Spam filter temporarily unavailable'
    };
  }
};

/**
 * Get numeric severity level
 * @param {string} severity - Severity level
 * @returns {number} - Numeric severity
 */
const getSeverityLevel = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

/**
 * Add new spam word (admin function)
 * @param {Object} wordData - Spam word data
 */
export const addSpamWord = async (wordData) => {
  try {
    const { word, severity = 'medium', action = 'block', replacement, createdBy } = wordData;

    const result = await query(
      `INSERT INTO spam_words (word, severity, action, replacement, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [word.toLowerCase(), severity, action, replacement, createdBy]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Add spam word error:', error);
    throw error;
  }
};

/**
 * Remove spam word (admin function)
 * @param {string} wordId - Spam word ID
 */
export const removeSpamWord = async (wordId) => {
  try {
    const result = await query(
      'DELETE FROM spam_words WHERE id = $1 RETURNING word',
      [wordId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Remove spam word error:', error);
    throw error;
  }
};

/**
 * Update spam word (admin function)
 * @param {string} wordId - Spam word ID
 * @param {Object} updates - Updated data
 */
export const updateSpamWord = async (wordId, updates) => {
  try {
    const { word, severity, action, replacement } = updates;
    
    const result = await query(
      `UPDATE spam_words 
       SET word = $1, severity = $2, action = $3, replacement = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [word?.toLowerCase(), severity, action, replacement, wordId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Update spam word error:', error);
    throw error;
  }
};

/**
 * Get all spam words (admin function)
 */
export const getAllSpamWords = async () => {
  try {
    const result = await query(
      `SELECT sw.*, u.email as created_by_email 
       FROM spam_words sw
       LEFT JOIN users u ON sw.created_by = u.id
       ORDER BY sw.severity DESC, sw.word ASC`
    );

    return result.rows;
  } catch (error) {
    console.error('Get spam words error:', error);
    throw error;
  }
};

/**
 * Bulk import spam words from array
 * @param {Array} words - Array of words to add
 * @param {string} createdBy - User ID who's adding the words
 */
export const bulkImportSpamWords = async (words, createdBy) => {
  try {
    const promises = words.map(wordData => 
      addSpamWord({ ...wordData, createdBy })
    );

    await Promise.all(promises);
    return { success: true, imported: words.length };
  } catch (error) {
    console.error('Bulk import spam words error:', error);
    throw error;
  }
};