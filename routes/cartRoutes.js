var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
  app.use('/api/v1/cart', router);

  router.get('/', isAuthenticated, async function(req, res) {
    const queryString = `SELECT carts.id, cart_items.product_id, products.name, cart_items.product_quantity, cart_items.product_price, 
                                cart_items.line_item_total_price
                           FROM carts, cart_items, products
                          WHERE carts.order_date IS NULL
                            AND carts.id = cart_items.cart_id
                            AND products.id = cart_items.product_id`

    try {
      const result = await db.query(queryString);

      if(result.rowCount > 0) {
          res.status(200).send(result.rows);
      } else if(result.rowCount === 0) {
          res.status(204).send();
      } else {
          res.status(400).send();
      }
    } catch (e) {
      res.status(400).send({message: e.message});
    }
 
  });

  router.get('/:cart_id', isAuthenticated, async function(req, res) { 
    const { cart_id } = req.params;

    const queryString = `SELECT carts.id, cart_items.product_id, products.name, cart_items.product_quantity, cart_items.product_price, cart_items.line_item_total_price
                           FROM carts, cart_items, products
                          WHERE carts.user_id = $1
                            AND carts.order_date IS NULL
                            AND carts.id = cart_items.cart_id
                            AND products.id = cart_items.product_id
                        `
    try {
      const result = await db.query(queryString, [parseInt(cart_id, 10)]);

      if(result.rowCount > 0) {
          res.status(200).send(result.rows); 
      } else {
          res.status(204).send({message: `no cart info for cart_id ${cart_id}`});
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
        res.status(200).send(result.rows); 
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
    var queryString = 'UPDATE cart_items SET product_quantity = $3, line_item_total_price = $4 WHERE cart_id = $1 AND product_id = $2 RETURNING *';

    console.log('asdf ' + cart_id);
    console.log('qwer ' + product_id);

    try {
      var result = await db.query(queryString, theVals);

      // get updated row
      queryString = "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2";
      result = await db.query(queryString, [parseInt(cart_id, 10), parseInt(product_id, 10)]);

      if(result.rowCount > 0) {
        res.status(200).send(result.rows); 
      } else {
        res.status(204).send({message: `item ${product_id} not updated`});
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