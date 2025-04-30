// 📁 controllers/notificationController.js

const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/mailer'); // You can stub this or connect to real service

// 🔔 Send notification (ADMIN → USER via email or internal alert)
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, sendEmailFlag } = req.body;

    // Save to DB
    const notification = new Notification({
      userId,
      title,
      message,
      createdAt: new Date(),
      read: false,
    });
    await notification.save();

    // Optional email
    if (sendEmailFlag) {
      await sendEmail(userId, title, message); // Dummy or actual email util
    }

    res.json({ message: 'Notification sent', notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📩 Get notifications for a user (frontend)
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
