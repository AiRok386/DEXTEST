const TokenBlacklist = require('../models/TokenBlacklist');
const jwt = require('jsonwebtoken');

router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000);

    await TokenBlacklist.create({ token, expiresAt });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
