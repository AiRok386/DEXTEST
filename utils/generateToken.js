// 📁 utils/generateToken.js

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token.
 * @param {Object} payload - The data to encode in the token.
 * @param {string} secret - The secret key to sign the token.
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d').
 * @returns {string} - The signed JWT.
 */
function generateToken(payload, secret, expiresIn = '1h') {
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;
