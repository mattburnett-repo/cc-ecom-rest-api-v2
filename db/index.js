"use strict";

const { Pool } = require('pg');
const { DB } = require('../config');

// FIXME comm'd code should work, pulling vals from .env file
// const pool = new Pool({
//   user: DB.PGUSER,
//   host: DB.PGHOST,
//   database: DB.PGDATABASE,
//   password: DB.PGPASSWORD,
//   port: DB.PGPORT
// });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'codecademy_ecommerce_rest_api_v2',
  password: 'postgres',
  port: 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params)
}