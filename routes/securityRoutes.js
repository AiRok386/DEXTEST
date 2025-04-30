// 📁 routes/securityRoutes.js

const express = require('express');
const router = express.Router();

const securityController = require('../controllers/securityController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validateRequest = require('../middleware/validateRequest');

// 🔐 Admin: View security logs (login attempts, suspicious activity)
router.get('/logs', authMiddleware, adminOnly, securityController.getSecurityLogs);

// 🔐 Admin: Ban an IP address
router.post(
  '/ban-ip',
  authMiddleware,
  adminOnly,
  validateRequest(['ip']),
  securityController.banIp
);

// 🔐 Admin: Unban an IP address
router.post(
  '/unban-ip',
  authMiddleware,
  adminOnly,
  validateRequest(['ip']),
  securityController.unbanIp
);

module.exports = router;
