const WebSocket = require('ws');
const { WS_BASE_URL } = require('../config/binance');
const formatBinanceData = require('../utils/formatBinanceData');

// Active sockets map
const sockets = {};

function subscribeToTicker(symbol, onMessage) {
  const wsSymbol = symbol.toLowerCase();
  const url = `${WS_BASE_URL}/${wsSymbol}@ticker`;

  const ws = new WebSocket(url);

  ws.on('open', () => {
    console.log(`📡 Connected to Binance WebSocket for ${symbol}`);
  });

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data);
      const formatted = formatBinanceData(parsed);
      onMessage(formatted);
    } catch (err) {
      console.error('⚠️ Error parsing WebSocket message:', err);
    }
  });

  ws.on('error', (err) => {
    console.error(`❌ WebSocket error for ${symbol}:`, err.message);
  });

  ws.on('close', () => {
    console.log(`🔌 WebSocket closed for ${symbol}`);
  });

  sockets[symbol] = ws;
}

function unsubscribeFromTicker(symbol) {
  const ws = sockets[symbol];
  if (ws) {
    ws.close();
    delete sockets[symbol];
  }
}

module.exports = {
  subscribeToTicker,
  unsubscribeFromTicker,
};
