// 📁 services/marketService.js

const axios = require('axios');
const WebSocket = require('ws');
const { formatBinanceData } = require('../utils/formatBinanceData');
const { logger } = require('../utils/logger');

let liveMarketData = {}; // In-memory cache of live prices and volume

// 1️⃣ Start Binance WebSocket stream for ticker data
function startBinanceTickerStream(symbols = ['btcusdt', 'ethusdt']) {
  const streamString = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
  const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamString}`);

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    const streamSymbol = data.stream.split('@')[0];
    const { c: lastPrice, v: volume } = data.data;

    liveMarketData[streamSymbol.toUpperCase()] = {
      price: parseFloat(lastPrice),
      volume: parseFloat(volume)
    };
  });

  ws.on('error', (err) => logger.error('Binance WS Error:', err.message));
  ws.on('close', () => {
    logger.warn('Binance WS Closed. Reconnecting...');
    setTimeout(() => startBinanceTickerStream(symbols), 5000);
  });
}

// 2️⃣ Get candlestick chart data (REST API)
async function getCandleData(symbol = 'BTCUSDT', interval = '1h', limit = 50) {
  try {
    const res = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: symbol.toUpperCase(),
        interval,
        limit
      }
    });

    return res.data.map(candle => formatBinanceData(candle));
  } catch (error) {
    logger.error('Failed to fetch Binance candle data:', error.message);
    return [];
  }
}

// 3️⃣ Get current market data from cache
function getLiveMarketData(symbol) {
  return liveMarketData[symbol.toUpperCase()] || null;
}

module.exports = {
  startBinanceTickerStream,
  getCandleData,
  getLiveMarketData
};
