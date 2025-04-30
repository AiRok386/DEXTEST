// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');
const { isAdmin } = require('../middlewares/auth');

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTokens = await Listing.countDocuments({ status: 'approved' });

    // Placeholder values for trades and earnings
    const totalVolume = 12345678.9; // USD
    const activeTrades = 250;       // Dummy value
    const earnings = 34567.89;      // USD, mock

    res.json({
      totalUsers,
      totalTokens,
      totalVolume,
      activeTrades,
      earnings
    });
  } catch (err) {
    console.error('Admin Dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET all token listings
router.get('/tokens', async (req, res) => {
  try {
    const tokens = await Listing.find().sort({ submittedAt: -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token listings' });
  }
});

// PUT update token info
router.put('/tokens/:id', async (req, res) => {
  try {
    const token = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!token) return res.status(404).json({ error: 'Token not found' });
    res.json({ message: 'Token updated', token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update token' });
  }
});

// PATCH approve/reject token
router.patch('/tokens/:id/status', async (req, res) => {
  const { status } = req.body; // status = 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const token = await Listing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!token) return res.status(404).json({ error: 'Token not found' });

    res.json({ message: `Token ${status}`, token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update token status' });
  }
});

// DELETE a token
router.delete('/tokens/:id', async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Token not found' });
    res.json({ message: 'Token deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete token' });
  }
});

const Announcement = require('../models/Announcement');

// POST new announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const newAnnouncement = await Announcement.create({ title, message, type });
    res.status(201).json({ message: 'Announcement posted', announcement: newAnnouncement });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post announcement' });
  }
});

// GET all announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// DELETE an announcement
router.delete('/announcements/:id', async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Announcement not found' });
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

const Wallet = require('../models/Wallet');

// GET all user wallets
router.get('/wallets', async (req, res) => {
  try {
    const wallets = await Wallet.find().populate('userId', 'email');
    res.json(wallets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
});

// PATCH freeze/unfreeze wallet
router.patch('/wallets/:id/freeze', async (req, res) => {
  const { freeze } = req.body; // true or false
  try {
    const wallet = await Wallet.findByIdAndUpdate(
      req.params.id,
      { frozen: freeze },
      { new: true }
    );
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json({ message: `Wallet ${freeze ? 'frozen' : 'unfrozen'}`, wallet });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wallet status' });
  }
});

// POST manual withdrawal trigger
router.post('/wallets/:id/withdraw', async (req, res) => {
  const { amount, address } = req.body;

  try {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    if (wallet.frozen) return res.status(403).json({ error: 'Wallet is frozen' });
    if (wallet.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    // Deduct balance (simulate)
    wallet.balance -= amount;
    await wallet.save();

    // Simulate blockchain transaction (add real blockchain integration later)
    res.json({
      message: `Withdrawal of ${amount} ${wallet.currency} triggered to ${address}`,
      txHash: 'MOCK_TX_HASH'
    });
  } catch (err) {
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

// GET all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PATCH update KYC status
router.patch('/users/:id/kyc', async (req, res) => {
  const { kycStatus } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(kycStatus)) {
    return res.status(400).json({ error: 'Invalid KYC status' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { kycStatus }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `KYC ${kycStatus}`, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update KYC status' });
  }
});

// PATCH suspend/ban/activate user
router.patch('/users/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['active', 'suspended', 'banned'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User ${status}`, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// PUT edit user info
router.put('/users/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Approve or reject withdrawal
router.post('/approve-withdrawal/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // action = 'approve' | 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    const tx = await Transaction.findById(id);
    if (!tx || tx.type !== 'withdraw' || tx.status !== 'pending') {
      return res.status(404).json({ error: 'Pending withdrawal not found' });
    }

    const wallet = await Wallet.findOne({ userId: tx.userId, currency: tx.currency });
    if (!wallet || wallet.frozen < tx.amount) {
      return res.status(400).json({ error: 'Invalid wallet state' });
    }

    if (action === 'approve') {
      wallet.frozen -= tx.amount;
      tx.status = 'approved';
    } else if (action === 'reject') {
      wallet.frozen -= tx.amount;
      wallet.balance += tx.amount;
      tx.status = 'rejected';
    }

    await wallet.save();
    await tx.save();

    res.json({ message: `Withdrawal ${action}d successfully`, tx });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Approve or reject withdrawal
router.post('/approve-withdrawal/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // action = 'approve' | 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    const tx = await Transaction.findById(id);
    if (!tx || tx.type !== 'withdraw' || tx.status !== 'pending') {
      return res.status(404).json({ error: 'Pending withdrawal not found' });
    }

    const wallet = await Wallet.findOne({ userId: tx.userId, currency: tx.currency });
    if (!wallet || wallet.frozen < tx.amount) {
      return res.status(400).json({ error: 'Invalid wallet state' });
    }

    if (action === 'approve') {
      wallet.frozen -= tx.amount;
      tx.status = 'approved';
    } else if (action === 'reject') {
      wallet.frozen -= tx.amount;
      wallet.balance += tx.amount;
      tx.status = 'rejected';
    }

    await wallet.save();
    await tx.save();

    res.json({ message: `Withdrawal ${action}d successfully`, tx });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve or reject withdrawal
router.post('/approve-withdrawal/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // action = 'approve' | 'reject'
  
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
  
    try {
      const tx = await Transaction.findById(id);
      if (!tx || tx.type !== 'withdraw' || tx.status !== 'pending') {
        return res.status(404).json({ error: 'Pending withdrawal not found' });
      }
  
      const wallet = await Wallet.findOne({ userId: tx.userId, currency: tx.currency });
      if (!wallet || wallet.frozen < tx.amount) {
        return res.status(400).json({ error: 'Invalid wallet state' });
      }
  
      if (action === 'approve') {
        wallet.frozen -= tx.amount;
        tx.status = 'approved';
      } else if (action === 'reject') {
        wallet.frozen -= tx.amount;
        wallet.balance += tx.amount;
        tx.status = 'rejected';
      }
  
      await wallet.save();
      await tx.save();
  
      res.json({ message: `Withdrawal ${action}d successfully`, tx });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
