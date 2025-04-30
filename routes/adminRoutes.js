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

// 🧠 Admin Access Middleware
const protect = [authMiddleware, adminOnly];

// 📊 Admin Dashboard
router.get('/dashboard', authMiddleware, adminOnly, adminController.getDashboard);


// 📈 Token/Listing Management
router.get('/listings', protect, listingController.getAllListings);
router.post('/listings', protect, validateRequest(['name', 'symbol']), listingController.createListing);
router.put('/listings/:id', protect, listingController.updateListing);
router.patch('/listings/:id/approve', protect, listingController.approveListing);
router.patch('/listings/:id/reject', protect, listingController.rejectListing);

// 📢 Announcements
router.post('/announcements', protect, validateRequest(['title', 'message']), announcementController.createAnnouncement);
router.get('/announcements', protect, announcementController.getAllAnnouncements);

// 💸 Funds Management
router.get('/wallets', protect, walletController.getAllWallets);
router.post('/wallets/freeze/:userId', protect, walletController.freezeWallet);
router.post('/wallets/unfreeze/:userId', protect, walletController.unfreezeWallet);
router.patch('/approve-withdrawal/:id', protect, walletController.approveWithdrawal);

// 👤 User Management
router.get('/users', protect, userController.getAllUsers);
router.get('/users/:id', protect, userController.getUserById);
router.patch('/users/:id/suspend', protect, userController.suspendUser);
router.patch('/users/:id/activate', protect, userController.activateUser);
router.patch('/users/:id/kyc', protect, userController.verifyKYC);

// 🔓 Logout
router.post('/logout', protect, adminController.logoutAdmin);

module.exports = router;
