// 📁 utils/formatBinanceData.js

/**
 * Format Binance WebSocket ticker data.
 * @param {Object} data - Raw Binance WebSocket ticker data.
 * @returns {Object} - Formatted data.
 */
function formatTickerData(data) {
    return {
      symbol: data.s,
      priceChange: data.p,
      priceChangePercent: data.P,
      lastPrice: data.c,
      highPrice: data.h,
      lowPrice: data.l,
      volume: data.v,
      quoteVolume: data.q,
      openPrice: data.o,
      eventTime: data.E
    };
  }
  
  /**
   * Format Binance candlestick (kline) data.
   * @param {Array} kline - [Open time, Open, High, Low, Close, Volume, ...]
   * @returns {Object} - Formatted kline candle object.
   */
  function formatKlineData(kline) {
    return {
      time: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5])
    };
  }
  
  module.exports = {
    formatTickerData,
    formatKlineData
  };
  