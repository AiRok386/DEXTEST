const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Register
router.post('/register', validateRequest(['email', 'password', 'username']), authController.register);

// 🔐 Login
router.post('/login', validateRequest(['email', 'password']), authController.login);

// 🔓 Logout
router.post('/logout', authMiddleware, authController.logoutUser);

module.exports = router;
