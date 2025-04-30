// 📁 routes/walletRoutes.js

const express = require('express');
const router = express.Router();

const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// 💰 Get user wallet balances
router.get('/balance', authMiddleware, walletController.getWalletBalance);

// 💳 Generate deposit address (mock)
router.get('/deposit-address', authMiddleware, walletController.getDepositAddress);

// 💸 Request withdrawal
router.post(
  '/withdraw',
  authMiddleware,
  validateRequest(['amount', 'currency', 'toAddress']),
  walletController.requestWithdrawal
);

// 📄 Get user's withdrawal history
router.get('/withdrawals', authMiddleware, walletController.getWithdrawals);

module.exports = router;
