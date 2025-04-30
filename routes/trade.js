const Order = require('../models/Order');

// Place a new order
router.post('/order', authenticateUser, async (req, res) => {
  const { pair, side, type, price, amount } = req.body;

  if (!pair || !side || !type || !amount || (type === 'limit' && !price)) {
    return res.status(400).json({ error: 'Invalid order parameters' });
  }

  try {
    const order = new Order({
      userId: req.user.id,
      pair,
      side,
      type,
      price: type === 'limit' ? price : null,
      amount
    });

    await order.save();
    res.json({ message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ error: 'Order placement failed' });
  }
});
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { matchOrder } = require('../services/matchingEngine');
const { authenticateUser } = require('../middlewares/auth');

// Place Order
router.post('/order', authenticateUser, async (req, res) => {
  const { pair, side, type, price, amount } = req.body;

  if (!pair || !side || !type || !amount || (type === 'limit' && !price)) {
    return res.status(400).json({ error: 'Invalid order parameters' });
  }

  try {
    const order = new Order({
      userId: req.user.id,
      pair,
      side,
      type,
      price: type === 'limit' ? price : null,
      amount
    });

    await order.save();
    await matchOrder(order); // 🔁 Call matching logic

    res.json({ message: 'Order placed and processed', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
