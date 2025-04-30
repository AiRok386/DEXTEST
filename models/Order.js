// 📁 models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pair: { type: String, required: true }, // e.g., "BTC/USDT"
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  orderType: {
    type: String,
    enum: ['limit', 'market'],
    required: true
  },
  price: { type: Number }, // Optional for market orders
  amount: { type: Number, required: true },
  filledAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['open', 'partially_filled', 'filled', 'cancelled'],
    default: 'open'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
