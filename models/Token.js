// 📁 models/Token.js

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  contractAddress: { type: String },
  listingStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Token', tokenSchema);
