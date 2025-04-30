// 📁 controllers/marketController.js

const axios = require('axios');
const WebSocket = require('ws');

// 🧠 Store live price & volume data in memory
let liveMarketData = {};

// 🌐 WebSocket Connection (Binance)
function startBinanceSocket(symbols = ['btcusdt', 'ethusdt']) {
  const streams = symbols.map(s => `${s}@ticker`).join('/');
  const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

  ws.on('message', (data) => {
    const parsed = JSON.parse(data);
    const symbol = parsed.data.s.toLowerCase();
    liveMarketData[symbol] = {
      price: parsed.data.c,
      volume: parsed.data.v,
      change: parsed.data.P,
    };
  });

  ws.on('error', (err) => {
    console.error('Binance WS error:', err);
  });

  ws.on('close', () => {
    console.log('WebSocket closed. Reconnecting...');
    setTimeout(() => startBinanceSocket(symbols), 3000);
  });
}

// 🟢 Start Binance price feed socket
startBinanceSocket();

// 📥 GET: All market data (price + volume)
exports.getMarketData = async (req, res) => {
  try {
    res.json(liveMarketData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📈 GET: Candlestick Chart (OHLCV) from Binance
exports.getCandlestickData = async (req, res) => {
  try {
    const { symbol = 'btcusdt', interval = '1h', limit = 50 } = req.query;

    const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: symbol.toUpperCase(),
        interval,
        limit,
      },
    });

    const formatted = response.data.map(candle => ({
      openTime: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
      closeTime: candle[6],
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
