// 📁 routes/userRoutes.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// 🧾 Get logged-in user profile
router.get('/profile', authMiddleware, userController.getProfile);

// 🧾 Update user profile
router.put(
  '/profile',
  authMiddleware,
  validateRequest(['username']),
  userController.updateProfile
);

// 🧾 Submit KYC
router.post(
  '/kyc',
  authMiddleware,
  validateRequest(['fullName', 'documentType', 'documentImage']),
  userController.submitKYC
);

// 🧾 Get KYC status
router.get('/kyc/status', authMiddleware, userController.getKYCStatus);

module.exports = router;
