const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'echobox',
  password: String(process.env.PSQL_PASSWORD),
  port: 5432,
});

module.exports = pool;
