// 📁 models/ListingRequest.js

const mongoose = require('mongoose');

const listingRequestSchema = new mongoose.Schema({
  tokenName: { type: String, required: true },
  symbol: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  contractAddress: { type: String },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: { type: Date },
  rejectionReason: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('ListingRequest', listingRequestSchema);
