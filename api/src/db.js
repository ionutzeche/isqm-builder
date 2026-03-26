const { Pool } = require('pg');
const connStr = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
const pool = new Pool({
  connectionString: connStr,
  ssl: connStr?.includes('localhost') ? false : { rejectUnauthorized: false }
});
module.exports = pool;
