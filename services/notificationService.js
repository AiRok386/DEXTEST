// 📁 services/notificationService.js

const Notification = require('../models/Notification');
const { logger } = require('../utils/logger');

// 🔔 Create a new notification for a user
async function createNotification(userId, title, message, type = 'info') {
  const notification = new Notification({
    userId,
    title,
    message,
    type // 'info', 'warning', 'success', 'error'
  });

  await notification.save();
  logger.info(`Notification created for User ${userId}: ${title}`);
  return notification;
}

// 📬 Get all notifications for a specific user
async function getUserNotifications(userId) {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
}

// ✅ Mark a single notification as read
async function markAsRead(notificationId) {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
}

// 🧹 Clear all notifications for a user (optional utility)
async function clearNotifications(userId) {
  await Notification.deleteMany({ userId });
  logger.info(`All notifications cleared for User ${userId}`);
  return true;
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  clearNotifications
};
