// 📁 controllers/announcementController.js

const Announcement = require('../models/Announcement');

// 🔒 ADMIN: Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const announcement = new Announcement({
      title,
      message,
      type: type || 'general', // default type
      createdAt: new Date(),
    });

    await announcement.save();
    res.status(201).json({ message: 'Announcement posted', announcement });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create announcement', error: err.message });
  }
};

// 🌐 PUBLIC: Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ announcements });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: err.message });
  }
};

// 🔒 ADMIN: Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete announcement', error: err.message });
  }
};
