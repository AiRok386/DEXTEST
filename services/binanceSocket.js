const WebSocket = require('ws');

const connectToBinance = (broadcastFn, symbols = ['btcusdt', 'ethusdt']) => {
  const streamNames = symbols.map(s => `${s}@ticker`).join('/');
  const binanceSocket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamNames}`);

  binanceSocket.on('message', (data) => {
    const parsed = JSON.parse(data);
    const ticker = parsed.data;

    const transformed = {
      symbol: ticker.s,
      price: ticker.c,
      volume: ticker.v,
      high: ticker.h,
      low: ticker.l,
      time: ticker.E
    };

    broadcastFn(transformed); // send data to connected clients
  });

  binanceSocket.on('open', () => console.log('✅ Connected to Binance WebSocket'));
  binanceSocket.on('close', () => console.warn('❌ Binance WebSocket closed'));
  binanceSocket.on('error', (err) => console.error('❗ Binance WebSocket error', err));
};

module.exports = connectToBinance;
