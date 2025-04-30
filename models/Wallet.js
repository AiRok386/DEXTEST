// 📁 models/Wallet.js

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', required: true },
  balance: { type: Number, default: 0 },
  frozen: { type: Number, default: 0 }, // used for open orders or restricted funds
  address: { type: String }, // optional: for on-chain deposit address
  lastUpdated: { type: Date, default: Date.now },
});

walletSchema.index({ user: 1, token: 1 }, { unique: true });

module.exports = mongoose.model('Wallet', walletSchema);
