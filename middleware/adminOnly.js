// 📁 middleware/adminOnly.js

const adminOnly = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: user not authenticated' });
    }
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin access only' });
    }
  
    next();
  };
  
  module.exports = adminOnly;
  