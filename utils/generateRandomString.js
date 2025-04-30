// 📁 utils/generateRandomString.js

const crypto = require('crypto');

/**
 * Generate a cryptographically secure random string.
 * @param {number} length - Length of the random string in bytes (default is 32).
 * @returns {string} - Hexadecimal string.
 */
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

module.exports = generateRandomString;
