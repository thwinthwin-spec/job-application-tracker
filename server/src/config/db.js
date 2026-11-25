const mongoose = require('mongoose');
const env = require('./env');

// Open the connection to MongoDB once, at startup or from the seed script.
async function connect() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('MongoDB connected:', env.mongodbUri);
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

// Close the connection so seed scripts can exit cleanly.
async function disconnect() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB disconnect failed:', error.message);
    throw error;
  }
}

module.exports = { connect, disconnect };
