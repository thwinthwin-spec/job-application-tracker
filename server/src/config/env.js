// Load environment variables from a local .env file when one exists.
require('dotenv').config();

// Keep configuration in one place. All values are plain strings.
const env = {
  port: process.env.PORT || '5001',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_tracker',
  jwtSecret: process.env.JWT_SECRET || 'dev_only_secret_change_me_before_deploy',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5174',
  seedUserEmail: process.env.SEED_USER_EMAIL || 'demo@jobtracker.test',
  seedUserPassword: process.env.SEED_USER_PASSWORD || 'Demo@123',
  seedOtherEmail: process.env.SEED_OTHER_EMAIL || 'other@jobtracker.test',
  seedOtherPassword: process.env.SEED_OTHER_PASSWORD || 'Other@123'
};

module.exports = env;
