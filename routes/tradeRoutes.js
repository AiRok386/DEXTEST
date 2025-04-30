// 📁 routes/tradeRoutes.js

const express = require('express');
const router = express.Router();

const tradeController = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// 📊 Public: Get real-time market data (prices, volume)
router.get('/markets', tradeController.getMarketOverview);

// 📈 Public: Get candlestick data for a pair
router.get('/candles/:symbol', tradeController.getCandlestickData);

// 📓 Authenticated: Place new order
router.post(
  '/order',
  authMiddleware,
  validateRequest(['symbol', 'side', 'type', 'quantity']),
  tradeController.placeOrder
);

// 📑 Authenticated: Get user orders
router.get('/orders', authMiddleware, tradeController.getUserOrders);

// ❌ Cancel order
router.delete('/order/:orderId', authMiddleware, tradeController.cancelOrder);

module.exports = router;
