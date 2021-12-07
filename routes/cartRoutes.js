var express = require('express');
var router = express.Router();

var db = require('../db');

router.get('/', async function(req, res, next) {
    // const queryString = "SELECT * FROM Carts WHERE order_date IS NULL"; // cart with order_date is not a cart anymore, but has become an order
    const queryString = "SELECT * FROM Carts";
    const result = await db.query(queryString);

    if(result.rowCount > 0) {
        res.status(200).send(result.rows);
    } else if(result.rowCount === 0) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});

router.get('/:cartID', async function(req, res, next) {
    try {
      const cartID = [parseInt(req.params.cartID)];
      const queryString = "SELECT * FROM Carts WHERE id = $1";
      const result = await db.query(queryString, cartID);

      if(result.rowCount > 0) {
          res.status(200).send(result.rows); 
      } else if (result.rowCount === 0) {
          res.status(204).send();
      } else {
          res.status(400).send();
      }      
    } catch (e) {
      res.status(400).send({message: e.message});
    }

});

router.post('/', async function(req, res, next) {
  try {
    var queryString = 'INSERT INTO carts (user_id) VALUES ($1) RETURNING *';

    const result = await db.query(queryString, [req.body.user_id]);

    if(result) {
      res.status(200).send(result.rows); 
      // res.status(201).send(); 
    } else {
      res.status(400).send();
    }  
  } catch (e) {
    res.status(400).send({message: e.message});
  }

});

router.post('/:cartID', async function(req, res, next) {
    try {
      var theVals = [req.params.cartID, req.body.product_id, req.body.product_quantity, req.body.product_price, (req.body.product_quantity * req.body.product_price)];
    
      var insertStatement = `INSERT INTO cart_items (cart_id, product_id, product_quantity, product_price, line_item_total_price) `;
      var valuesStatement = `VALUES (${theVals}) RETURNING *`;
      var queryString = insertStatement + valuesStatement;

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

  router.put('/:cartID', async function(req, res, next) {
    try {
      var theVals = [req.params.cartID, req.body.cart_item_id, req.body.product_quantity, (req.body.product_quantity * req.body.product_price)];
    
      var queryString = 'UPDATE cart_items SET product_quantity = $3, line_item_total_price = $4 WHERE cart_id = $1 AND id = $2 RETURNING *';
      var result = await db.query(queryString, theVals);

      // get updated row
      queryString = "SELECT * FROM cart_items WHERE id = $1";
      result = await db.query(queryString, [req.body.cart_item_id]);

      if(result.rowCount > 0) {
        res.status(200).send(result.rows); 
      } else if (result.rowCount === 0) {
        res.status(204).send({message: `item ${req.body.cart_item_id} not updated`});
      } else {
        res.status(400).send();
      }     
    } catch (e) {
      res.status(400).send({message: e.message});
    }

  });

  router.delete('/:cartID', async function(req, res, next) {
    try {
      var theVals = [req.params.cartID, req.body.cart_item_id];
    
      const queryString = "DELETE FROM cart_items WHERE cart_id = $1 AND id = $2";
      const result = await db.query(queryString, theVals);
    
      if(result) {
        res.status(200).send(result.rows); 
      } else {
        res.status(400).send();
      }     
    } catch (e) {
      res.status(400).send({message: e.message});
    }

  });

  // NOTE: we don't delete carts. Carts become Orders, that's why carts table has order_date     

  module.exports = router;