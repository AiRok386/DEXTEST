// 📁 config/db.js

const mongoose = require('mongoose');

// ✅ MongoDB Connection Setup
// Loads the DB_URI from .env and connects to the database

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // Stop app if DB fails
  }
};

connectDB();

module.exports = mongoose;
