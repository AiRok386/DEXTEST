// 📁 services/walletService.js

const Wallet = require('../models/Wallet');
const { logger } = require('../utils/logger');

// 📦 Get wallet by user and token
async function getWallet(userId, tokenSymbol) {
  let wallet = await Wallet.findOne({ user: userId, token: tokenSymbol });

  if (!wallet) {
    wallet = await Wallet.create({ user: userId, token: tokenSymbol, balance: 0 });
    logger.info(`Wallet created for user ${userId} and token ${tokenSymbol}`);
  }

  return wallet;
}

// 💰 Deposit balance (mock or detected externally)
async function deposit(userId, tokenSymbol, amount) {
  const wallet = await getWallet(userId, tokenSymbol);
  wallet.balance += parseFloat(amount);
  await wallet.save();
  logger.info(`Deposited ${amount} ${tokenSymbol} to user ${userId}`);
  return wallet;
}

// 🧾 Withdraw balance (manual or via admin approval)
async function requestWithdrawal(userId, tokenSymbol, amount) {
  const wallet = await getWallet(userId, tokenSymbol);

  if (wallet.balance < amount) {
    throw new Error('Insufficient balance');
  }

  wallet.pendingWithdrawals.push({ amount, date: new Date(), status: 'pending' });
  await wallet.save();

  logger.info(`Withdrawal requested: ${amount} ${tokenSymbol} from user ${userId}`);
  return wallet;
}

// ✅ Approve withdrawal (admin)
async function approveWithdrawal(userId, tokenSymbol, withdrawalId) {
  const wallet = await getWallet(userId, tokenSymbol);
  const withdrawal = wallet.pendingWithdrawals.id(withdrawalId);

  if (!withdrawal || withdrawal.status !== 'pending') {
    throw new Error('Invalid withdrawal request');
  }

  if (wallet.balance < withdrawal.amount) {
    throw new Error('Insufficient balance');
  }

  wallet.balance -= withdrawal.amount;
  withdrawal.status = 'approved';
  withdrawal.processedAt = new Date();

  await wallet.save();
  logger.info(`Withdrawal approved: ${withdrawal.amount} ${tokenSymbol} from user ${userId}`);
  return wallet;
}

// ❌ Reject withdrawal (admin)
async function rejectWithdrawal(userId, tokenSymbol, withdrawalId) {
  const wallet = await getWallet(userId, tokenSymbol);
  const withdrawal = wallet.pendingWithdrawals.id(withdrawalId);

  if (!withdrawal || withdrawal.status !== 'pending') {
    throw new Error('Invalid withdrawal request');
  }

  withdrawal.status = 'rejected';
  withdrawal.processedAt = new Date();

  await wallet.save();
  logger.info(`Withdrawal rejected: ${withdrawal.amount} ${tokenSymbol} from user ${userId}`);
  return wallet;
}

// 📊 Get all user wallets (admin/user dashboard)
async function getUserWallets(userId) {
  return await Wallet.find({ user: userId });
}

module.exports = {
  getWallet,
  deposit,
  requestWithdrawal,
  approveWithdrawal,
  rejectWithdrawal,
  getUserWallets,
};
