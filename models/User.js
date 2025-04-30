// 📁 models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  isEmailVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  isFrozen: { type: Boolean, default: false },

  kycStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'approved', 'rejected'],
    default: 'not_submitted'
  },

  balances: {
    type: Map,
    of: Number,
    default: {} // { BTC: 0.5, USDT: 1200, ETH: 3.2 }
  },

  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  ipHistory: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);
