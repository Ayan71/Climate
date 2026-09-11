const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return true;
  }
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.warn('[MongoDB Notice] MONGODB_URI not provided. Operating in hybrid/memory fallback mode.');
      return false;
    }
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Notice] ${error.message}. Operating in hybrid/memory fallback mode.`);
    return false;
  }
};

module.exports = connectDB;

