var express = require('express');
var router = express.Router();

var db = require('../db');

router.post('/', async function(req, res, next) {
    var queryString = 'SELECT SUM(line_item_total_price) AS total_price FROM cart_items WHERE cart_id = $1';
    var result = await db.query(queryString, [req.body.cart_id]);
    var total_price = result.rows[0].total_price;

    console.log('post: ' + total_price);

    queryString = 'UPDATE carts SET order_date = Now() WHERE id = $1';
    result = await db.query(queryString,[req.body.cart_id]);

    queryString = "INSERT INTO orders(user_id, cart_id, total_price) VALUES ($1, $2, $3) RETURNING *";
    result = await db.query(queryString, [req.body.user_id, req.body.cart_id, total_price]);
  
    if(result) {
      res.status(200).send(result.rows);
    } else {
      res.status(400).send();
    }
  });

router.get('/', async function(req, res, next) {
  const queryString = "SELECT * FROM orders";
  const result = await db.query(queryString);

  if(result) {
    res.status(200).send(result.rows);
  } else {
    res.status(400).send();
  }
});

router.get('/:orderID', async function(req, res, next) {
  const queryString = "SELECT * FROM orders WHERE id = $1";
  const result = await db.query(queryString, [req.params.orderID]);

  if(result) {
    res.status(200).send(result.rows);
  } else {
    res.status(400).send();
  }
});

router.delete('/:orderID', async function(req, res, next) {
  const queryString = "DELETE FROM orders WHERE id = $1";
  const result = await db.query(queryString, [req.params.id]);

  if(result) {
    res.status(204).send(result.rows); 
  } else {
    res.status(400).send();
  }
});

module.exports = router;