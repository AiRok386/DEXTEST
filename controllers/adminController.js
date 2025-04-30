// 📁 controllers/adminController.js

const User = require('../models/User');
const Token = require('../models/Token');
const Announcement = require('../models/Announcement');
const Withdrawal = require('../models/Withdrawal');

// 📊 Admin Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingKYC = await User.countDocuments({ 'kyc.status': 'pending' });
    const totalVolume = await Token.aggregate([{ $group: { _id: null, volume: { $sum: '$volume' } } }]);

    const activeTrades = 0; // TODO: Replace with actual trades count
    const earnings = 0;     // TODO: Replace with actual earnings logic

    res.json({
      totalUsers,
      pendingKYC,
      totalVolume: totalVolume[0]?.volume || 0,
      activeTrades,
      earnings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💸 Approve/Reject Withdrawal
exports.approveWithdrawal = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status, processedAt: new Date(), processedBy: req.user.id },
      { new: true }
    );
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    res.json({ message: `Withdrawal ${status}`, withdrawal });
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

// 👥 Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚫 Suspend User
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
exports.logoutAdmin = (req, res) => {
  res.json({ message: 'Admin logged out' });
};
