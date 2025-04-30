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

    res.json({
      totalUsers,
      pendingKYC,
      totalVolume: totalVolume[0]?.volume || 0,
      activeTrades: 0, // placeholder
      earnings: 0      // placeholder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Approve or Reject Withdrawal
exports.approveWithdrawal = async (req, res) => {
  try {
    const { status } = req.body; // expected: 'approved' or 'rejected'
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      {
        status,
        processedAt: new Date(),
        processedBy: req.user._id
      },
      { new: true }
    );
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    res.json({ message: `Withdrawal ${status}`, withdrawal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚪 Admin Logout
exports.logoutAdmin = (req, res) => {
  res.json({ message: 'Admin logged out' });
};
