// 📁 controllers/tradeController.js

const Order = require('../models/Order');
const Trade = require('../models/Trade');
const Wallet = require('../models/Wallet');

// 🔁 GET: Order book (public)
exports.getOrderBook = async (req, res) => {
  try {
    const { pair } = req.query;

    const buyOrders = await Order.find({ pair, type: 'buy', status: 'open' })
      .sort({ price: -1 })
      .limit(20);

    const sellOrders = await Order.find({ pair, type: 'sell', status: 'open' })
      .sort({ price: 1 })
      .limit(20);

    res.json({ buyOrders, sellOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🛒 POST: Place order (limit/market)
exports.placeOrder = async (req, res) => {
  try {
    const { pair, type, orderType, amount, price } = req.body;
    const userId = req.user.id;

    const [base, quote] = pair.split('/'); // e.g., BTC/USDT

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    // Balance check
    if (type === 'buy') {
      const required = orderType === 'market' ? Number.MAX_VALUE : price * amount;
      if ((wallet.balances[quote] || 0) < required)
        return res.status(400).json({ message: 'Insufficient balance' });
    } else if (type === 'sell') {
      if ((wallet.balances[base] || 0) < amount)
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create order
    const order = new Order({
      user: userId,
      pair,
      type,
      orderType,
      amount,
      price,
      remaining: amount,
      status: 'open',
    });

    await order.save();

    // Match order (basic logic)
    await matchOrder(order);

    res.json({ message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⚙️ Basic matching engine logic
async function matchOrder(order) {
  const isBuy = order.type === 'buy';
  const [base, quote] = order.pair.split('/');
  const userWallet = await Wallet.findOne({ user: order.user });

  const oppositeOrders = await Order.find({
    pair: order.pair,
    type: isBuy ? 'sell' : 'buy',
    status: 'open',
  })
    .sort({ price: isBuy ? 1 : -1, createdAt: 1 });

  for (const match of oppositeOrders) {
    if (
      (isBuy && match.price > order.price) ||
      (!isBuy && match.price < order.price)
    )
      break;

    const matchedAmount = Math.min(order.remaining, match.remaining);
    const tradePrice = match.price;

    const buyer = isBuy ? order.user : match.user;
    const seller = isBuy ? match.user : order.user;

    // Update balances
    const buyerWallet = await Wallet.findOne({ user: buyer });
    const sellerWallet = await Wallet.findOne({ user: seller });

    if (
      !buyerWallet ||
      !sellerWallet ||
      (buyerWallet.balances[quote] || 0) < tradePrice * matchedAmount ||
      (sellerWallet.balances[base] || 0) < matchedAmount
    )
      continue;

    buyerWallet.balances[base] = (buyerWallet.balances[base] || 0) + matchedAmount;
    buyerWallet.balances[quote] -= tradePrice * matchedAmount;

    sellerWallet.balances[base] -= matchedAmount;
    sellerWallet.balances[quote] =
      (sellerWallet.balances[quote] || 0) + tradePrice * matchedAmount;

    await buyerWallet.save();
    await sellerWallet.save();

    // Update order book
    order.remaining -= matchedAmount;
    match.remaining -= matchedAmount;

    if (order.remaining <= 0) order.status = 'filled';
    if (match.remaining <= 0) match.status = 'filled';

    await order.save();
    await match.save();

    // Log the trade
    const trade = new Trade({
      pair: order.pair,
      price: tradePrice,
      amount: matchedAmount,
      buyer,
      seller,
    });

    await trade.save();

    if (order.status === 'filled') break;
  }
}
