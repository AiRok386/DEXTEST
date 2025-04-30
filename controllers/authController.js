// 📁 controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 🔐 Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// 📝 POST: Register
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      username,
      passwordHash: hashed,
      role: 'user',
    });

    await user.save();

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 POST: Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔓 POST: Logout
exports.logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
