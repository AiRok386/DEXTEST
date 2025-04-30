// 📁 models/Trade.js

const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  pair: { type: String, required: true }, // e.g., "BTC/USDT"
  buyOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  sellOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  total: { type: Number, required: true }, // price * amount
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trade', tradeSchema);
