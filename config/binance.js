// 📁 crypto-backend/config/binance.js

module.exports = {
    BASE_URL: 'https://api.binance.com',
    WS_BASE_URL: 'wss://stream.binance.com:9443/ws',
  
    // Example endpoints
    endpoints: {
      ticker24h: (symbol) => `/api/v3/ticker/24hr?symbol=${symbol}`,
      klines: (symbol, interval, limit = 100) =>
        `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    },
  
    // Symbols default if not specified
    defaultSymbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
  };
  