const Order = require('../models/Order');
const Trade = require('../models/Trade');

async function matchOrder(newOrder) {
  const isBuy = newOrder.side === 'buy';

  const oppositeOrders = await Order.find({
    pair: newOrder.pair,
    side: isBuy ? 'sell' : 'buy',
    status: 'open',
    ...(newOrder.type === 'market' ? {} : {
      price: isBuy ? { $lte: newOrder.price } : { $gte: newOrder.price }
    })
  }).sort({ price: isBuy ? 1 : -1, createdAt: 1 });

  let remaining = newOrder.amount;

  for (let opp of oppositeOrders) {
    const matchAmount = Math.min(remaining, opp.amount - opp.filled);
    const price = opp.price || newOrder.price;

    await Trade.create({
      pair: newOrder.pair,
      buyOrderId: isBuy ? newOrder._id : opp._id,
      sellOrderId: isBuy ? opp._id : newOrder._id,
      price,
      amount: matchAmount
    });

    // Update filled values
    opp.filled += matchAmount;
    newOrder.filled += matchAmount;

    if (opp.filled >= opp.amount) opp.status = 'filled';
    else opp.status = 'partial';

    await opp.save();

    remaining -= matchAmount;
    if (remaining <= 0) break;
  }

  newOrder.status =
    newOrder.filled === newOrder.amount ? 'filled' :
    newOrder.filled > 0 ? 'partial' : 'open';

  await newOrder.save();
}

module.exports = { matchOrder };
