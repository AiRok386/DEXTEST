// 📁 routes/notificationRoutes.js

const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validateRequest = require('../middleware/validateRequest');

// 🔒 Authenticated users: Get personal notifications
router.get('/', authMiddleware, notificationController.getUserNotifications);

// 🔐 Admin: Broadcast notification to all users
router.post(
  '/',
  authMiddleware,
  adminOnly,
  validateRequest(['title', 'message']),
  notificationController.sendGlobalNotification
);

module.exports = router;
