// 📁 controllers/adminController.js

const User = require('../models/User');
const Token = require('../models/Token');
const Announcement = require('../models/Announcement');
const Withdrawal = require('../models/Withdrawal');

// 📊 Admin Dashboard
exports.getDashboardStats = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const pendingKYC = await User.countDocuments({ 'kyc.status': 'pending' });
      const totalVolume = await Token.aggregate([{ $group: { _id: null, volume: { $sum: '$volume' } } }]);
      const activeTrades = 0; // Placeholder: Replace with actual trades count
      const earnings = 0; // Placeholder: Add logic for commission/fees
      {
  res.json({ message: 'Admin dashboard is live' });
};
      res.json({
        totalUsers,
        pendingKYC,
        totalVolume: totalVolume[0]?.volume || 0,
        activeTrades,
        earnings,
      });
    } catch (err) {
      res.status(200).json({ message: 'Dashboard working' });
    }
  };
// ✅ This MUST exist:
exports.getDashboard = async (req, res) => {
  res.json({ message: 'Dashboard data' });
};


  // 🪙 List All Tokens
exports.listTokens = async (req, res) => {
    try {
      const tokens = await Token.find();
      res.json(tokens);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // ➕ Create Token
exports.createToken = async (req, res) => {
    try {
      const newToken = new Token(req.body);
      await newToken.save();
      res.status(201).json(newToken);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // ✏️ Edit Token
exports.updateToken = async (req, res) => {
    try {
      const token = await Token.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(token);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // ✅ Approve Token
exports.approveToken = async (req, res) => {
    try {
      const token = await Token.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
      res.json({ message: 'Token approved.', token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // ❌ Reject Token
exports.rejectToken = async (req, res) => {
    try {
      await Token.findByIdAndDelete(req.params.id);
      res.json({ message: 'Token rejected and deleted.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// 📢 Post Announcement
exports.postAnnouncement = async (req, res) => {
    try {
      const announcement = new Announcement(req.body);
      await announcement.save();
      res.status(201).json(announcement);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // 💸 View All Withdrawals
exports.getWithdrawals = async (req, res) => {
    try {
      const withdrawals = await Withdrawal.find();
      if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

       withdrawal.status = 'approved';
       withdrawal.processedAt = new Date();
       withdrawal.processedBy = req.user.id;

    await withdrawal.save();
      res.json(message, 'Withdrawal approved.', withdrawal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // ✅ Approve/Reject Withdrawal
  exports.approveWithdrawal = async (req, res) => {
    try {
      const { status } = req.body; // 'approved' or 'rejected'
      const withdrawal = await Withdrawal.findByIdAndUpdate(req.params.id, { status }, { new: true });
      res.json({ message: `Withdrawal ${status}`, withdrawal });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
// 🔍 View All Users
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // 🔐 Suspend or Ban User
  exports.suspendUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: 'suspended' }, { new: true });
      res.json({ message: 'User suspended.', user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // 🔓 Reactivate User
  exports.reactivateUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: 'active' }, { new: true });
      res.json({ message: 'User reactivated.', user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
// 🚪 Admin Logout
exports.logout = (req, res) => {
    // Frontend should remove JWT; backend just responds
    res.json({ message: 'Admin logged out' });
  };    
