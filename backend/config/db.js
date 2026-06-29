const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/thundra');
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚠️ Running in mock mode: data will be saved in-memory for this session. Start MongoDB to persist data.');
    return false;
  }
};

module.exports = connectDB;
