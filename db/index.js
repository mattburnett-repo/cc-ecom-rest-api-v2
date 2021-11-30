"use strict";

const { Pool } = require('pg');

const devConfig = {
  user: process.env.DATABASE_USER_NAME,
  host: process.env.DATABASE_HOSTNAME,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
};

// UnhandledPromiseRejectionWarning: error: no pg_hba.conf entry for host "3.86.254.150", user "bjonkuvjlhiska", database "deqs5qjkrb94vk", SSL off
const prodConfig = {
  connectionString: process.env.HEROKU_POSTGRESQL_ONYX_URL + "?sslmode=verify-full"
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? prodConfig : devConfig
);

module.exports = {
  query: (text, params) => pool.query(text, params)
}