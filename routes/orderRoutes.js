var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
  app.use('/api/v1/order', router);

  router.post('/', isAuthenticated, async function(req, res) {
      try {
        const { cart_id, user_id } = req.body;

        var queryString = 'SELECT SUM(line_item_total_price) AS total_price FROM cart_items WHERE cart_id = $1';
        var result = await db.query(queryString, [parseInt(cart_id, 10)]);
        var total_price = result.rows[0].total_price;

        // console.log('post: ' + total_price);

        queryString = 'UPDATE carts SET order_date = Now() WHERE id = $1';
        result = await db.query(queryString, [parseInt(cart_id, 10)]);

        queryString = "INSERT INTO orders(user_id, cart_id, order_date, total_price) VALUES ($1, $2, $3, $4) RETURNING *";
        var orderDate = new Date();
        result = await db.query(queryString, [parseInt(user_id, 10), parseInt(cart_id, 10), orderDate, total_price]);
      
        if(result) {
          res.status(200).send(result.rows);
        } else {
          res.status(400).send();
        }
      } catch (e) {
        res.status(400).send({message: e.message});
      }
    });

  router.get('/', isAuthenticated, async function(req, res) {
    try {
      const queryString = "SELECT * FROM orders";
      const result = await db.query(queryString);

      if(result) {
        res.status(200).send(result.rows);
      } else {
        res.status(400).send();
      }
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });

  router.get('/:orderID', isAuthenticated, async function(req, res) {
    try {
      const queryString = "SELECT * FROM orders WHERE id = $1";
      const result = await db.query(queryString, [parseInt(req.params.orderID)]);

      if(result) {
        res.status(200).send(result.rows);
      } else {
        res.status(400).send();
      }    
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });

  router.delete('/', isAuthenticated, async function(req, res) {
    try {
      const { order_id } = req.body;
      const queryString = "DELETE FROM orders WHERE id = $1";
      const result = await db.query(queryString, [parseInt(order_id, 10)]);

      if(result) {
        res.status(200).send(result.rows); 
      } else {
        res.status(400).send();
      }   
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });
}
