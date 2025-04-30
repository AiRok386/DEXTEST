// 📁 services/announcementService.js

const Announcement = require('../models/Announcement');
const { logger } = require('../utils/logger');

// 📢 Create a new announcement (admin only)
async function createAnnouncement(data, adminId) {
  const announcement = new Announcement({
    title: data.title,
    message: data.message,
    type: data.type || 'general', // types: general, maintenance, promo, etc.
    postedBy: adminId
  });

  await announcement.save();
  logger.info(`Announcement created by Admin ${adminId}: ${announcement.title}`);
  return announcement;
}

// 📋 Get all announcements (admin or frontend)
async function getAllAnnouncements() {
  return await Announcement.find().sort({ createdAt: -1 });
}

// 🧽 Delete a specific announcement
async function deleteAnnouncement(id) {
  const deleted = await Announcement.findByIdAndDelete(id);
  if (!deleted) throw new Error('Announcement not found');
  logger.info(`Announcement deleted: ${deleted.title}`);
  return deleted;
}

// 🖊️ Update an announcement
async function updateAnnouncement(id, updateData) {
  const updated = await Announcement.findByIdAndUpdate(id, updateData, { new: true });
  if (!updated) throw new Error('Announcement not found');
  logger.info(`Announcement updated: ${updated.title}`);
  return updated;
}

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  updateAnnouncement
};
