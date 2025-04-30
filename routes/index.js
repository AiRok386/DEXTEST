// 📁 routes/index.js

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const walletRoutes = require('./walletRoutes');
const tradeRoutes = require('./tradeRoutes');
const listingRoutes = require('./listingRoutes');
const announcementRoutes = require('./announcementRoutes');
const marketRoutes = require('./marketRoutes');
const notificationRoutes = require('./notificationRoutes');
const securityRoutes = require('./securityRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/wallets', walletRoutes);
router.use('/trades', tradeRoutes);
router.use('/listings', listingRoutes);
router.use('/announcements', announcementRoutes);
router.use('/market', marketRoutes);
router.use('/notifications', notificationRoutes);
router.use('/security', securityRoutes);

module.exports = router;
