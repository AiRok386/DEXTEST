// 📁 models/Announcement.js

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['update', 'maintenance', 'event', 'general'],
    default: 'general'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  isVisible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Announcement', announcementSchema);
