// 📁 services/binanceService.js

const WebSocket = require('ws');
const axios = require('axios');
const EventEmitter = require('events');
const { formatBinanceData } = require('../utils/formatBinanceData');

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

class BinanceService extends EventEmitter {
  constructor() {
    super();
    this.sockets = {};
  }

  // Start WebSocket to track real-time prices for a symbol
  startPriceFeed(symbol = 'btcusdt') {
    const stream = `${symbol.toLowerCase()}@ticker`;

    const ws = new WebSocket(`${BINANCE_WS_URL}/${stream}`);

    ws.on('open', () => {
      console.log(`[WS] Connected to Binance price stream for ${symbol}`);
    });

    ws.on('message', (msg) => {
      const data = JSON.parse(msg);
      const formatted = {
        symbol: data.s,
        price: data.c,
        volume: data.v,
        change: data.P,
        high: data.h,
        low: data.l
      };
      this.emit('priceUpdate', formatted);
    });

    ws.on('error', (err) => console.error(`[WS Error] ${err.message}`));

    ws.on('close', () => {
      console.log(`[WS] Price feed closed for ${symbol}`);
    });

    this.sockets[symbol] = ws;
  }

  // Fetch candlestick chart data using Binance REST API
  async fetchCandlestickData(symbol = 'BTCUSDT', interval = '1h', limit = 100) {
    try {
      const response = await axios.get(`${BINANCE_API_BASE}/klines`, {
        params: { symbol, interval, limit }
      });

      return response.data.map(candle => formatBinanceData(candle));
    } catch (error) {
      console.error('Error fetching candlestick data:', error.message);
      return [];
    }
  }

  stopAllFeeds() {
    Object.values(this.sockets).forEach((ws) => ws.close());
    this.sockets = {};
  }
}

module.exports = new BinanceService();
