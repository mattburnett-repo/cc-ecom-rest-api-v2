const { query } = require('express');
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

  router.get('/user/:id', isAuthenticated, async function(req, res) {
    const user_id = parseInt(req.params.id, 10)

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
                          WHERE o.user_id = $1`;

    try {
      const result = await db.query(queryString, [user_id]);

      if(result) {
        res.status(200).send(result.rows);
      } else {
        res.status(400).send();
      }    
    } catch (e) {
      res.status(400).send({message: e.message});
    }
  });

  // create order
  router.post('/', isAuthenticated, async function(req, res) {
    const { orderData } = req.body;

    try {
      // insert cart data
      var queryString = `INSERT INTO carts(user_id, name)
                              VALUES ($1, $2) RETURNING *`;
      var theVals = [ parseInt(orderData.user_id, 10), `Cart for user id ${orderData.user_id}`]

      var result = await db.query(queryString, theVals)
      let cartId = result.rows[0].id

      // insert cart items
      for(var i=0; i < orderData.cartInfo.length; i++) {
        // FIXME: use real line item total price vals
        queryString = `INSERT INTO cart_items(cart_id, product_id, product_quantity, product_price, line_item_total_price)
                            VALUES ($1, $2, $3, $4, $5)`
        theVals = [cartId, orderData.cartInfo[i].id, orderData.cartInfo[i].quantity, orderData.cartInfo[i].price, 1234]

        result = await db.query(queryString, theVals)
      }

      // insert shipping data
      queryString = `INSERT INTO addresses (first_name, last_name, address_1, address_2, city, state_province, postal_code, country)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
      theVals = [ orderData.shippingInfo.firstName, orderData.shippingInfo.lastName, orderData.shippingInfo.address1, 
                  orderData.shippingInfo.address2, orderData.shippingInfo.city, orderData.shippingInfo.stateProvince, 
                  orderData.shippingInfo.postalCode, orderData.shippingInfo.country]

      result = await db.query(queryString, theVals)
      let addressId = result.rows[0].id

      queryString = `INSERT INTO users_addresses (user_id, address_id)
                      VALUES($1, $2)`
      theVals = [ orderData.user_id, addressId ]
      result = await db.query(queryString, theVals)

      // insert payment data
      // FIXME: use real amount value
      queryString = `INSERT INTO payments (user_id, stripe_id, created, payment_method, receipt_url, transaction_status, amount)
                      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`
      theVals = [ orderData.user_id, orderData.paymentInfo.charge.id, orderData.paymentInfo.charge.created, orderData.paymentInfo.charge.payment_method,
                  orderData.paymentInfo.charge.receipt_url, orderData.paymentInfo.charge.status, 1234]

      result = await db.query(queryString, theVals)
      let paymentId = result.rows[0].id

      queryString = `INSERT INTO users_payments (user_id, payment_id)
                      VALUES($1, $2)`
      theVals = [ orderData.user_id, paymentId ]

      result = await db.query(queryString, theVals)

      // insert order data
      // FIXME: use real total price vals
      queryString = "INSERT INTO orders(user_id, cart_id, total_price) VALUES ($1, $2, $3) RETURNING *";
      // var orderDate = new Date();
      result = await db.query(queryString, [parseInt(orderData.user_id, 10), cartId, 1234]);
      let orderId = result.rows[0].id

      // get final order record
      queryString = "SELECT * from orders WHERE id = $1"
      theVals = [ orderId ]
      result = await db.query(queryString, theVals)

      // console.log('orderRoutes saveOrderData final query result.rows', result.rows)

      res.status(200).send(result.rows)
    } catch(e) {
      console.log('orderRoutes / post error: ', e)
      res.status(400).send({message: e.message});
    }
  }); // end create order

  router.delete('/', isAuthenticated, async function(req, res) {
    const { order_id } = req.body;
    const queryString = "DELETE FROM orders WHERE id = $1";

    // TODO: needs to remove data from other tables...

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
