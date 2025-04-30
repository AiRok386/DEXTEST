// models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  description: String,
  website: String,
  contactEmail: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);

// routes/listing.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// POST /api/listing - Submit new token listing request
router.post('/', async (req, res) => {
  try {
    const { name, symbol, description, website, contactEmail } = req.body;

    if (!name || !symbol) {
      return res.status(400).json({ error: 'Name and symbol are required' });
    }

    const newListing = new Listing({
      name,
      symbol,
      description,
      website,
      contactEmail
    });

    await newListing.save();
    res.status(201).json({ message: 'Listing request submitted', listing: newListing });
  } catch (error) {
    console.error('Listing submission error:', error);
    res.status(500).json({ error: 'Failed to submit listing request' });
  }
});

// GET /api/listing - Get all submitted listings (for admin panel later)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ submittedAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching listings' });
  }
});

module.exports = router;
