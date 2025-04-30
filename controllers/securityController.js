// 📁 controllers/securityController.js

const IPBlock = require('../models/IPBlock');
const TransactionLog = require('../models/TransactionLog');
const User = require('../models/User');

// 🔒 ADMIN: Block an IP address
exports.blockIP = async (req, res) => {
  try {
    const { ip, reason } = req.body;

    const existing = await IPBlock.findOne({ ip });
    if (existing) return res.status(400).json({ message: 'IP already blocked' });

    const block = new IPBlock({ ip, reason, blockedAt: new Date() });
    await block.save();

    res.json({ message: 'IP blocked successfully', block });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 ADMIN: View all blocked IPs
exports.getBlockedIPs = async (req, res) => {
  try {
    const blocks = await IPBlock.find().sort({ blockedAt: -1 });
    res.json({ blocks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 ADMIN: View transaction logs (filtered optional by user)
exports.getTransactionLogs = async (req, res) => {
  try {
    const { userId } = req.query;
    const logs = userId
      ? await TransactionLog.find({ user: userId }).sort({ createdAt: -1 })
      : await TransactionLog.find().sort({ createdAt: -1 });

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 ADMIN: Freeze or unfreeze a user account
exports.toggleAccountFreeze = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isFrozen = !user.isFrozen;
    await user.save();

    res.json({
      message: `User account ${user.isFrozen ? 'frozen' : 'unfrozen'}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
