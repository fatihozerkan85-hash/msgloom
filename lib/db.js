const { neon } = require('@neondatabase/serverless');

function getDb() {
  return neon(process.env.POSTGRES_URL);
}

module.exports = { getDb };
