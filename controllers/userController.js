// 📁 controllers/userController.js

const User = require('../models/User');

// 👤 Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📤 Submit KYC Details
exports.submitKYC = async (req, res) => {
  try {
    const { fullName, documentType, documentNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        kyc: {
          status: 'pending',
          fullName,
          documentType,
          documentNumber
        }
      },
      { new: true }
    );
    res.status(200).json({ message: 'KYC submitted for review.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 Account Freeze (Admin only)
exports.freezeAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: 'frozen' }, { new: true });
    res.status(200).json({ message: 'User account frozen.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔓 Unfreeze Account (Admin only)
exports.unfreezeAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: 'active' }, { new: true });
    res.status(200).json({ message: 'User account reactivated.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
