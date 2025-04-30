// 📁 routes/marketRoutes.js

const express = require('express');
const router = express.Router();

const marketController = require('../controllers/marketController');

// 🌐 Real-time: Get all tickers (price + volume)
router.get('/tickers', marketController.getLiveTickers);

// 📊 Historical candlestick data (e.g. for charts)
router.get('/candlesticks/:symbol', marketController.getCandlestickData);

// 📈 Order Book (depth)
router.get('/orderbook/:symbol', marketController.getOrderBook);

module.exports = router;
