// 📁 routes/adminRoutes.js

const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const listingController = require('../controllers/listingController');
const announcementController = require('../controllers/announcementController');
const walletController = require('../controllers/walletController');
const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validateRequest = require('../middleware/validateRequest');

// 📊 Dashboard
router.get('/dashboard', authMiddleware, adminOnly, adminController.getDashboard);

// 📈 Token Listings
router.post('/listings', authMiddleware, adminOnly, validateRequest(['name', 'symbol']), listingController.createListing);
router.put('/listings/:id', authMiddleware, adminOnly, listingController.updateListing);
router.patch('/listings/:id/approve', authMiddleware, adminOnly, listingController.approveListing);
router.patch('/listings/:id/reject', authMiddleware, adminOnly, listingController.rejectListing);

// 📢 Announcements
router.post('/announcements', authMiddleware, adminOnly, validateRequest(['title', 'message']), announcementController.createAnnouncement);
router.delete('/announcements/:id', authMiddleware, adminOnly, announcementController.deleteAnnouncement);

// 💸 Wallets & Withdrawals
router.get('/wallets', authMiddleware, adminOnly, walletController.getAllWallets);
router.post('/wallets/freeze/:userId', authMiddleware, adminOnly, walletController.freezeWallet);
router.post('/wallets/unfreeze/:userId', authMiddleware, adminOnly, walletController.unfreezeWallet);
router.patch('/approve-withdrawal/:id', authMiddleware, adminOnly, adminController.approveWithdrawal);

// 👥 Users
router.get('/users', authMiddleware, adminOnly, userController.getAllUsers);
router.get('/users/:id', authMiddleware, adminOnly, userController.getUserById);
router.patch('/users/:id/suspend', authMiddleware, adminOnly, userController.suspendUser);
router.patch('/users/:id/activate', authMiddleware, adminOnly, userController.activateUser);
router.patch('/users/:id/kyc', authMiddleware, adminOnly, userController.verifyKYC);

// 🚪 Logout
router.post('/logout', authMiddleware, adminOnly, adminController.logoutAdmin);

module.exports = router;
