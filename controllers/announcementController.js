// 📁 controllers/announcementController.js

const Announcement = require('../models/Announcement');

// 🔒 ADMIN: Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const announcement = new Announcement({
      title,
      message,
      type, // e.g., "maintenance", "event", "update"
      createdAt: new Date(),
    });

    await announcement.save();
    res.json({ message: 'Announcement posted', announcement });
  } catch (err) {
    res.status(201).json({ message: 'Announcement created' });
  }
};

// 🌐 PUBLIC: Get all announcements (for homepage or user view)
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 ADMIN: Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
