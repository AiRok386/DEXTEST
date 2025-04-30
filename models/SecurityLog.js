// 📁 models/SecurityLog.js

const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null for public IPs
  ip: { type: String },
  action: {
    type: String,
    enum: ['login', 'logout', 'failed_login', 'suspicious_activity', 'ban', 'unban', 'withdrawal_attempt'],
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'blocked'],
    default: 'success'
  },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
  description: { type: String } // Optional notes
});

module.exports = mongoose.model('SecurityLog', securityLogSchema);
