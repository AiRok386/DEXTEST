// 📁 services/listingService.js

const Listing = require('../models/Listing');
const Token = require('../models/Token');
const { logger } = require('../utils/logger');

// 📥 User submits listing request
async function submitListingRequest(data) {
  const newListing = new Listing({
    name: data.name,
    symbol: data.symbol.toUpperCase(),
    contractAddress: data.contractAddress,
    decimals: data.decimals,
    website: data.website,
    description: data.description,
    submittedBy: data.submittedBy,
    status: 'pending'
  });

  await newListing.save();
  logger.info(`New token listing request submitted by ${data.submittedBy}: ${data.symbol}`);
  return newListing;
}

// 📋 Admin fetches all pending or all listings
async function getAllListings(filter = {}) {
  return await Listing.find(filter).sort({ createdAt: -1 });
}

// ✅ Admin approves the listing request
async function approveListing(listingId, adminId) {
  const listing = await Listing.findById(listingId);
  if (!listing || listing.status !== 'pending') {
    throw new Error('Invalid or already processed listing');
  }

  // Create token entry for trading
  const token = new Token({
    name: listing.name,
    symbol: listing.symbol,
    contractAddress: listing.contractAddress,
    decimals: listing.decimals,
    listedBy: adminId,
    isActive: true
  });

  await token.save();

  listing.status = 'approved';
  listing.reviewedBy = adminId;
  listing.reviewedAt = new Date();
  await listing.save();

  logger.info(`Token approved and listed: ${listing.symbol}`);
  return { listing, token };
}

// ❌ Admin rejects the listing request
async function rejectListing(listingId, adminId, reason = '') {
  const listing = await Listing.findById(listingId);
  if (!listing || listing.status !== 'pending') {
    throw new Error('Invalid or already processed listing');
  }

  listing.status = 'rejected';
  listing.reviewedBy = adminId;
  listing.reviewedAt = new Date();
  listing.rejectionReason = reason;

  await listing.save();
  logger.info(`Token listing rejected: ${listing.symbol}`);
  return listing;
}

// 🛠️ Admin manually creates or updates a token
async function updateToken(tokenId, updateData) {
  const token = await Token.findByIdAndUpdate(tokenId, updateData, { new: true });
  logger.info(`Token updated: ${token.symbol}`);
  return token;
}

// 📦 Get all live tokens (for frontend display)
async function getAllActiveTokens() {
  return await Token.find({ isActive: true });
}

module.exports = {
  submitListingRequest,
  getAllListings,
  approveListing,
  rejectListing,
  updateToken,
  getAllActiveTokens
};
