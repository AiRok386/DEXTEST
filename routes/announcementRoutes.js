// 📁 routes/announcementRoutes.js

const express = require('express');
const router = express.Router();

const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validateRequest = require('../middleware/validateRequest');

// 🌍 Public: Get all announcements
router.get('/', announcementController.getAllAnnouncements);

// 🔐 Admin: Post new announcement
router.post(
  '/announcements',
  authMiddleware,
  adminOnly,
  validateRequest(['title', 'message']),
  announcementController.postAnnouncement
);

module.exports = router;
