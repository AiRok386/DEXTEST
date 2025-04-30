// 📁 services/securityService.js

const SecurityLog = require('../models/SecurityLog');
const { logger } = require('../utils/logger');

// 📌 Log a security-related event
async function logSecurityEvent(userId, action, details = '', ipAddress = 'N/A') {
  const log = new SecurityLog({
    userId,
    action,          // e.g., 'login_attempt', 'withdrawal_request', 'ip_blacklist'
    details,
    ipAddress
  });

  await log.save();
  logger.info(`Security log: ${action} by user ${userId} from IP ${ipAddress}`);
  return log;
}

// 📄 Get all logs (admin panel usage)
async function getSecurityLogs(filters = {}) {
  return await SecurityLog.find(filters).sort({ createdAt: -1 });
}

// 🚫 Check if an IP is blacklisted (can be expanded into DB + Redis)
const blacklistedIPs = new Set();

function isBlacklistedIP(ip) {
  return blacklistedIPs.has(ip);
}

// 🔒 Add an IP to the blacklist
function addToBlacklist(ip) {
  blacklistedIPs.add(ip);
  logger.warn(`IP blacklisted: ${ip}`);
}

// ✅ Remove an IP from the blacklist
function removeFromBlacklist(ip) {
  blacklistedIPs.delete(ip);
  logger.info(`IP removed from blacklist: ${ip}`);
}

module.exports = {
  logSecurityEvent,
  getSecurityLogs,
  isBlacklistedIP,
  addToBlacklist,
  removeFromBlacklist
};
