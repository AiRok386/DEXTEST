// routes/market.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/market/candles?symbol=BTCUSDT&interval=1m&limit=100
router.get('/candles', async (req, res) => {
  const { symbol, interval = '1m', limit = 100 } = req.query;

  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await axios.get(url);

    const candles = response.data.map(c => ({
      time: c[0],      // Open time
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
      volume: c[5]
    }));

    res.json(candles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch candlestick data' });
  }
});

module.exports = router;
