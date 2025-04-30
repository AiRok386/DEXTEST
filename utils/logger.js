// 📁 utils/logger.js

const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFile = path.join(logDirectory, 'exchange.log');

/**
 * Logs messages to both console and a log file.
 * @param {string} level - Log level ('INFO', 'ERROR', etc.).
 * @param {string} message - Log message.
 */
function log(level, message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(formattedMessage);

  // Append to log file
  fs.appendFileSync(logFile, formattedMessage + '\n', { encoding: 'utf8' });
}

module.exports = {
  info: (msg) => log('INFO', msg),
  error: (msg) => log('ERROR', msg),
  warn: (msg) => log('WARN', msg),
  debug: (msg) => log('DEBUG', msg)
};
