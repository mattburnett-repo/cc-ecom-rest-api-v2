var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
  app.use('/api/v1/cart', router);

  router.get('/', isAuthenticated, async function(req, res) {
    // const queryString = "SELECT * FROM Carts WHERE order_date IS NULL"; // cart with order_date is not a cart anymore, but has become an order
    const queryString = "SELECT * FROM Carts";
    const result = await db.query(queryString);

    if(result.rowCount > 0) {
        res.status(200).json(result.rows);
    } else if(result.rowCount === 0) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
  });

  router.get('/:cart_id', isAuthenticated, async function(req, res) {  // FIXME: should bring back all of the cart items...
    const queryString = "SELECT * FROM Carts WHERE id = $1";

    try {
      const result = await db.query(queryString, [parseInt(req.params.cart_id)]);

      if(result.rowCount > 0) {
          res.status(200).json(result.rows); 
      } else {
          res.status(400).send();
      }      
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });

  // FIXME: figure best way to add cart for a user

  router.post('/', isAuthenticated, async function(req, res) {
    const { cart_id, product_id, product_quantity, product_price } = req.body;
    var line_item_total_price = (product_quantity * product_price);
    var theVals = [parseInt(cart_id, 10), parseInt(product_id, 10), parseInt(product_quantity, 10), product_price, line_item_total_price];

    var insertStatement = `INSERT INTO cart_items (cart_id, product_id, product_quantity, product_price, line_item_total_price) `;
    var valuesStatement = `VALUES (${theVals}) RETURNING *`;
    var queryString = insertStatement + ' ' + valuesStatement;

    try {
      const result = await db.query(queryString);

      if(result.rowCount > 0) {
        res.status(200).json(result.rows); 
      } else {
        res.status(400).send();
      }      
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });

  router.put('/', isAuthenticated, async function(req, res) {
    const { cart_id, product_id, product_quantity, product_price } = req.body;
    const line_item_total_price = (product_quantity * product_price);
    const theVals = [parseInt(cart_id, 10), parseInt(product_id, 10), parseInt(product_quantity, 10), line_item_total_price]; 
    const queryString = 'UPDATE cart_items SET product_quantity = $3, line_item_total_price = $4 WHERE cart_id = $1 AND product_id = $2 RETURNING *';

    try {
      const result = await db.query(queryString, theVals);

      // get updated row
      queryString = "SELECT * FROM cart_items WHERE id = $1";
      result = await db.query(queryString, [parseInt(result.rows[0].id, 10)]);

      if(result.rowCount > 0) {
        res.status(200).json(result.rows); 
      } else if (result.rowCount === 0) {
        res.status(204).send({message: `item ${product_id} not updated`});
      } else {
        res.status(400).send();
      }     
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });

  router.delete('/', isAuthenticated, async function(req, res) {
    const { cart_id, product_id } = req.body; 
    const theVals = [parseInt(cart_id, 10), parseInt(product_id, 10)];
    const queryString = "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2";

    try {
      const result = await db.query(queryString, theVals);
      
      if(result) {
        res.status(200).send({ message: `product_id ${product_id} deleted from cart_id ${cart_id}`}); 
      } else {
        res.status(400).send();
      }     
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });

  // NOTE: we don't delete carts. Carts become Orders, that's why carts table has order_date     
}