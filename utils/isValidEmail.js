// 📁 utils/isValidEmail.js

/**
 * Validates an email string against a standard email pattern.
 * @param {string} email - Email address to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  module.exports = isValidEmail;
  