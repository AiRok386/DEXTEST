const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateUser } = require('../middlewares/auth');

// Get user wallet balances
router.get('/balances', authenticateUser, walletController.getBalances);

// Simulate deposit
router.post('/deposit', authenticateUser, walletController.mockDeposit);

// Request withdrawal
router.post('/withdraw', authenticateUser, walletController.requestWithdrawal);

module.exports = router;
