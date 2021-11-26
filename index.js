const dbUsername = process.env.DATABASE_USER_NAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbName = process.env.DATABASE_NAME;

// https://www.thisdot.co/blog/connecting-to-postgresql-with-node-js
// see also: https://medium.com/@dannibla/connecting-nodejs-postgresql-f8967b9f5932

const { Pool, Client } = require("pg");

const credentials = {
  user: dbUsername,
  host: "localhost",
  database: dbName,
  password: dbPassword,
  port: 5432,
};

// Connect with a connection pool.

async function poolDemo() {
  const pool = new Pool(credentials);
  const now = await pool.query("SELECT NOW()");
  await pool.end();

  return now;
}

// Connect with a client.

async function clientDemo() {
  const client = new Client(credentials);
  await client.connect();
  const now = await client.query("SELECT NOW()");
  await client.end();

  return now;
}

// Use a self-calling function so we can use async / await.

(async () => {
  const poolResult = await poolDemo();
  console.log("Time with pool: " + poolResult.rows[0]["now"]);

  const clientResult = await clientDemo();
  console.log("Time with client: " + clientResult.rows[0]["now"]);
})();
