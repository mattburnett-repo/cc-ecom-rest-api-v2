var express = require('express');
// var { Client } = require("pg");

var router = express.Router();

// TODO: 
//    clean up connection code. convert to Pool. use .env for connectionString
//    error handling for result const assign

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var pg = require("pg")
  var connectionString = "pg://postgres:postgres@localhost:5432/codecademy_ecommerce_rest_api_v2";
  var client = new pg.Client(connectionString);
  client.connect();

  var queryString = "SELECT * FROM Users";

  const result = await client.query(queryString);

  res.status(200).send({ query: 'users', results: result.rows});
});

module.exports = router;
