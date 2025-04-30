// 📁 services/tradeService.js

const Order = require('../models/Order');
const Trade = require('../models/Trade');
const Wallet = require('../models/Wallet');
const { logger } = require('../utils/logger');

// ✅ Create a new order (buy/sell)
async function placeOrder(userId, { symbol, side, price, quantity, type }) {
  const order = await Order.create({
    user: userId,
    symbol: symbol.toUpperCase(),
    side,
    price,
    quantity,
    type,
    status: 'open'
  });

  logger.info(`New order placed: ${order._id}`);
  await matchOrders(symbol.toUpperCase());

  return order;
}

// 🔁 Match buy/sell orders (basic matching engine)
async function matchOrders(symbol) {
  const buyOrders = await Order.find({ symbol, side: 'buy', status: 'open' }).sort({ price: -1, createdAt: 1 });
  const sellOrders = await Order.find({ symbol, side: 'sell', status: 'open' }).sort({ price: 1, createdAt: 1 });

  for (let buy of buyOrders) {
    for (let sell of sellOrders) {
      if (buy.price >= sell.price && buy.status === 'open' && sell.status === 'open') {
        const tradeQty = Math.min(buy.quantity, sell.quantity);
        const tradePrice = sell.price;

        // 💰 Handle buyer wallet (deduct quote currency, add base)
        await Wallet.updateOne(
          { user: buy.user },
          {
            $inc: {
              [`balances.${symbol.split('USDT')[0]}`]: tradeQty,
              [`balances.USDT`]: -tradeQty * tradePrice
            }
          }
        );

        // 💰 Handle seller wallet (add USDT, deduct base asset)
        await Wallet.updateOne(
          { user: sell.user },
          {
            $inc: {
              [`balances.USDT`]: tradeQty * tradePrice,
              [`balances.${symbol.split('USDT')[0]}`]: -tradeQty
            }
          }
        );

        // 📝 Create trade record
        await Trade.create({
          symbol,
          price: tradePrice,
          quantity: tradeQty,
          buyOrder: buy._id,
          sellOrder: sell._id,
          buyer: buy.user,
          seller: sell.user
        });

        // 🔄 Update orders
        buy.quantity -= tradeQty;
        sell.quantity -= tradeQty;

        if (buy.quantity === 0) {
          buy.status = 'filled';
        }

        if (sell.quantity === 0) {
          sell.status = 'filled';
        }

        await buy.save();
        await sell.save();
      }
    }
  }
}

// 📊 Get order book
async function getOrderBook(symbol) {
  const buyOrders = await Order.find({ symbol: symbol.toUpperCase(), side: 'buy', status: 'open' }).sort({ price: -1 });
  const sellOrders = await Order.find({ symbol: symbol.toUpperCase(), side: 'sell', status: 'open' }).sort({ price: 1 });

  return {
    buy: buyOrders,
    sell: sellOrders
  };
}

module.exports = {
  placeOrder,
  matchOrders,
  getOrderBook
};
