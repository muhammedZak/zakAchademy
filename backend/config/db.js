const mongoose = require('mongoose');

const connectDB = async () => {
  const DB = process.env.MONGO_URI.replace(
    '<password>',
    process.env.MONGO_PASS
  );

  try {
    const conn = await mongoose.connect(DB);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
