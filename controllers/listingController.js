// 📁 controllers/listingController.js

const ListingRequest = require('../models/ListingRequest');
const Token = require('../models/Token');

// 🌐 USER submits apply-for-listing request
exports.applyForListing = async (req, res) => {
  try {
    const { name, symbol, network, contractAddress, website, description } = req.body;

    const listing = new ListingRequest({
      user: req.user.id,
      name,
      symbol,
      network,
      contractAddress,
      website,
      description,
      status: 'pending',
    });

    await listing.save();

    res.json({ message: 'Listing request submitted', listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 ADMIN: view all listing requests
exports.getAllListings = async (req, res) => {
 try {
    const listings = await ListingRequest.find().populate('user', 'email');
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 ADMIN: approve listing request (token goes live)
exports.approveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ListingRequest.findById(id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'approved';
    await request.save();

    // Add token to live trading
    const token = new Token({
      name: request.name,
      symbol: request.symbol,
      network: request.network,
      contractAddress: request.contractAddress,
      website: request.website,
      description: request.description,
      isActive: true,
    });

    await token.save();

    res.json({ message: 'Token listing approved', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔒 ADMIN: reject listing request
exports.rejectListing = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ListingRequest.findById(id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Token listing rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
