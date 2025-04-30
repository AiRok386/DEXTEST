// 📁 controllers/walletController.js

const Wallet = require('../models/Wallet');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// 📥 GET: User wallet balance
exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ POST: Mock deposit (simulate deposit)
exports.mockDeposit = async (req, res) => {
  try {
    const { asset, amount } = req.body;
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user.id, balances: {} });
    }

    wallet.balances[asset] = (wallet.balances[asset] || 0) + parseFloat(amount);
    await wallet.save();

    res.json({ message: `Deposited ${amount} ${asset}`, wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➖ POST: Request withdrawal
exports.requestWithdrawal = async (req, res) => {
  try {
    const { asset, amount, address } = req.body;
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet || (wallet.balances[asset] || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawal = new Withdrawal({
      user: req.user.id,
      asset,
      amount,
      address,
      status: 'pending',
    });

    await withdrawal.save();
    res.json({ message: 'Withdrawal requested. Awaiting approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 GET: All pending withdrawals (admin)
exports.getPendingWithdrawals = async (req, res) => {
  try {
    const list = await Withdrawal.find({ status: 'pending' }).populate('user', 'email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ POST: Admin approves/rejects withdrawal
exports.approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    const wallet = await Wallet.findOne({ user: withdrawal.user });

    if (action === 'approve') {
      if ((wallet.balances[withdrawal.asset] || 0) < withdrawal.amount) {
        return res.status(400).json({ message: 'Insufficient balance for approval' });
      }

      wallet.balances[withdrawal.asset] -= withdrawal.amount;
      withdrawal.status = 'approved';
      await wallet.save();
    } else if (action === 'reject') {
      withdrawal.status = 'rejected';
    }

    await withdrawal.save();
    res.json({ message: `Withdrawal ${action}ed successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
