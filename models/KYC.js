// 📁 models/KYC.js

const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  nationality: { type: String },
  documentType: {
    type: String,
    enum: ['passport', 'national_id', 'driver_license'],
    required: true
  },
  documentNumber: { type: String, required: true },
  documentImageFront: { type: String }, // URL or file path
  documentImageBack: { type: String },  // Optional
  selfieImage: { type: String },        // Optional for liveness check
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  adminReviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  notes: { type: String }
});

module.exports = mongoose.model('KYC', kycSchema);
