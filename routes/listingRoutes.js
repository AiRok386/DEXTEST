// 📁 routes/listingRoutes.js

const express = require('express');
const router = express.Router();

const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validateRequest = require('../middleware/validateRequest');

// 🧾 User: Apply for new crypto listing
router.post(
  '/apply',
  authMiddleware,
  validateRequest(['tokenName', 'symbol', 'website', 'description']),
  listingController.applyForListing
);

// 🔍 Admin: View all listing applications
router.get('/admin/applications', authMiddleware, adminOnly, listingController.viewApplications);

// ✅ Admin: Approve listing
router.post('/admin/approve/:id', authMiddleware, adminOnly, listingController.approveListing);

// ❌ Admin: Reject listing
router.post('/admin/reject/:id', authMiddleware, adminOnly, listingController.rejectListing);

module.exports = router;
