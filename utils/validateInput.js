// 📁 utils/validateInput.js

/**
 * Validates if all required fields are present in the input object.
 * @param {Object} data - The input object to validate.
 * @param {string[]} requiredFields - Array of field names to check.
 * @returns {{ valid: boolean, missing?: string[] }}
 */
function validateInput(data, requiredFields) {
    const missing = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
    
    if (missing.length > 0) {
      return { valid: false, missing };
    }
  
    return { valid: true };
  }
  
  module.exports = validateInput;
  