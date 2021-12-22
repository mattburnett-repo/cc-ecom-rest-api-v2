var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
  app.use('/api/v1/order', router);

  // TODO: the get queries are... long... Someday we can refactor everything over to Models...
  router.get('/', isAuthenticated, async function(req, res) {
    const queryString = `select jsonb_build_object('order_id', o.id, 
                                              'user_id', o.user_id, 
                                              'cart', cart,
                                              'order_date', o.order_date, 
                                              'total_price', order_total) as order
                          from orders o
                          join (
                            select ci.cart_id as cart_id, 
                                   jsonb_agg(jsonb_build_object('product_id', ci.product_id, 
                                                                'product_quantity', ci.product_quantity, 
                                                                'product_name', p.name,
                                                                'product_price', ci.product_price,
                                                                'product_total_price', ci.line_item_total_price)
                                            ) as cart_items
                            from cart_items ci
                            join products p on p.id = ci.product_id
                            group by ci.cart_id
                          ) cart on cart.cart_id = o.cart_id
                          join (
                            select cart_id, sum(line_item_total_price)
                               from cart_items
                            group by cart_id
                          ) order_total on order_total.cart_id = o.cart_id`;

    try {
      const result = await db.query(queryString);

      if(result) {
        res.status(200).send(result.rows);
        return
      } else {
        res.status(400).send();
        return
      }
    } catch (e) {
      res.status(400).send({message: e.message});
      return
    }
  });

  router.get('/:order_id', isAuthenticated, async function(req, res) {
    const { order_id } = req.params;
    const queryString = `select jsonb_build_object('order_id', o.id, 
                                              'user_id', o.user_id, 
                                              'cart', cart,
                                              'order_date', o.order_date, 
                                              'total_price', order_total) as order
                          from orders o
                          join (
                            select ci.cart_id as cart_id, 
                                   jsonb_agg(jsonb_build_object('product_id', ci.product_id, 
                                                                'product_quantity', ci.product_quantity, 
                                                                'product_name', p.name,
                                                                'product_price', ci.product_price,
                                                                'product_total_price', ci.line_item_total_price)
                                            ) as cart_items
                            from cart_items ci
                            join products p on p.id = ci.product_id
                            group by ci.cart_id
                          ) cart on cart.cart_id = o.cart_id
                          join (
                            select cart_id, sum(line_item_total_price)
                               from cart_items
                            group by cart_id
                          ) order_total on order_total.cart_id = o.cart_id
                          WHERE o.id = $1`;

    try {
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

  router.post('/', isAuthenticated, async function(req, res) {
      try {
        const { cart_id, user_id } = req.body;

        // get total price
        var queryString = `SELECT orders.id AS order_id, SUM(line_item_total_price) AS total_price
                             FROM orders
                             JOIN cart_items
                               ON cart_items.cart_id = orders.id
                            WHERE orders.user_id = $2
                              AND cart_items.cart_id = $1
                            GROUP BY orders.id`;
        var result = await db.query(queryString, [parseInt(cart_id, 10)]);
        var total_price = result.rows[0].total_price;

        // set order date, to make cart into an order
        queryString = 'UPDATE carts SET order_date = Now() WHERE id = $1';
        result = await db.query(queryString, [parseInt(cart_id, 10)]);

        // create order record
        queryString = "INSERT INTO orders(user_id, cart_id, order_date, total_price) VALUES ($1, $2, $3, $4) RETURNING *";
        var orderDate = new Date();
        result = await db.query(queryString, [parseInt(user_id, 10), parseInt(cart_id, 10), orderDate, total_price]);
      
        res.status(200).send(result.rows);

      } catch (e) {
        res.status(400).send({message: e.message});
      }
    });

  router.delete('/', isAuthenticated, async function(req, res) {
    const { order_id } = req.body;
    const queryString = "DELETE FROM orders WHERE id = $1";

    try {
      const result = await db.query(queryString, [parseInt(order_id, 10)]);

      if(result) {
        res.status(200).send(result.rows); 
      } 
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });
}
