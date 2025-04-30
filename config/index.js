// 📁 config/index.js

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/crypto-exchange',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  BINANCE_WS_URL: 'wss://stream.binance.com:9443/ws',
  BINANCE_REST_URL: 'https://api.binance.com',
  EMAIL_FROM: process.env.EMAIL_FROM || 'support@yourcex.com',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 587
};
