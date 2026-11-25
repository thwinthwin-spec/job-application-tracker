const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');

// Connect first, then start accepting requests.
async function start() {
  try {
    await db.connect();

    app.listen(env.port, '0.0.0.0', function () {
      console.log('Job Tracker API running on http://0.0.0.0:' + env.port);
    });
  } catch (error) {
    console.error('Could not start the API:', error.message);
    process.exit(1);
  }
}

start();
