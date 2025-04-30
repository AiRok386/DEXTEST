// 📁 middleware/validateRequest.js

module.exports = (fields = []) => {
  return (req, res, next) => {
    const missing = fields.filter((field) => !req.body[field]);
    if (missing.length) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
    }
    next();
  };
};
