// 📁 services/userService.js

const User = require('../models/User');
const KYC = require('../models/KYC');
const { logger } = require('../utils/logger');

// 👤 Get user by ID
async function getUserById(userId) {
  return await User.findById(userId).select('-password');
}

// 📜 Get all registered users
async function getAllUsers() {
  return await User.find().select('-password');
}

// 🚫 Suspend a user account
async function suspendUser(userId) {
  await User.findByIdAndUpdate(userId, { status: 'suspended' });
  logger.info(`User ${userId} suspended.`);
}

// ✅ Activate a user account
async function activateUser(userId) {
  await User.findByIdAndUpdate(userId, { status: 'active' });
  logger.info(`User ${userId} activated.`);
}

// 🗂️ Submit or update KYC for user
async function submitKYC(userId, kycData) {
  const existing = await KYC.findOne({ user: userId });
  if (existing) {
    return await KYC.findOneAndUpdate({ user: userId }, kycData, { new: true });
  } else {
    return await KYC.create({ user: userId, ...kycData });
  }
}

// 🔍 View user KYC status
async function getUserKYC(userId) {
  return await KYC.findOne({ user: userId });
}

// 🧾 Update user profile
async function updateUserProfile(userId, updates) {
  return await User.findByIdAndUpdate(userId, updates, { new: true });
}

// ❌ Delete user account (admin-only)
async function deleteUser(userId) {
  await User.findByIdAndDelete(userId);
  await KYC.deleteMany({ user: userId });
  logger.warn(`User ${userId} and related KYC deleted.`);
}

module.exports = {
  getUserById,
  getAllUsers,
  suspendUser,
  activateUser,
  submitKYC,
  getUserKYC,
  updateUserProfile,
  deleteUser
};
