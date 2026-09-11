const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Notice] ${error.message}. Operating in hybrid/memory fallback mode.`);
    return false;
  }
};

module.exports = connectDB;
