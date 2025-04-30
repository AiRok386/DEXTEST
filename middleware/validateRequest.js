// 📁 middleware/validateRequest.js

const validateRequest = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => {
      return !(field in req.body) || req.body[field] === '';
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

module.exports = validateRequest;
