var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
  app.use('/api/v1/product', router);

  router.get('/', isAuthenticated, async function(req, res) {
    const queryString = "SELECT * FROM Products";
    
    try {
      const result = await db.query(queryString);

      if(result) {
        res.status(200).json(result.rows);
      } else {
        res.status(400).send();
      }   
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.get('/:id', isAuthenticated, async function(req, res) {
    const { id } = req.params;
    const queryString = "SELECT * FROM Products WHERE id = $1";

    try {
      const result = await db.query(queryString, [parseInt(id, 10)]);

      if(result.rowCount > 0) {
        res.status(200).send(result.rows[0]); 
      } else if (result.rowCount === 0) {
        res.status(400).send([{'message': `product id ${id} not found`}]);
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.post('/', isAuthenticated, async function(req, res) {
    const { category_id, name, description, price, image_url } = req.body;
    const theVals = [category_id, name, description, price, image_url];
    const queryString = 'INSERT INTO products(category_id, name, description, price, image_url) VALUES($1, $2, $3, $4, $5) RETURNING *';

    try {
      const result = await db.query(queryString, theVals);

      if(result) {
        res.status(201).json(result.rows); 
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.put('/', isAuthenticated, async function(req, res) {
    const { id, category_id, name, description, price, image_url } = req.body;
    const theVals = [parseInt(id, 10), parseInt(category_id, 10), name, description, price, image_url];
    const queryString = 'UPDATE Products SET category_id = $2, name = $3, description = $4, price = $5, image_url = $6 WHERE id = $1 RETURNING *';

    try {
      const result = await db.query(queryString, theVals);

      if(result.rowCount === 1) {
        res.status(200).json(result.rows); 
      } else if (result.rowCount === 0) {
        res.status(204).send({ message: `product_id: ${id} not found.`});
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.delete('/', isAuthenticated, async function(req, res) {
    const { product_id } = req.body;
    const theVals = [parseInt(product_id, 10)];
    const queryString = "DELETE FROM products WHERE id = $1";

    try {
      const result = await db.query(queryString, theVals);

      if(result) {
        res.status(204).json(result.rows); 
      } else {
        res.status(400).send();
      }   
    } catch(e) {
      res.status(400).send({message: e.message});
    } 
  });

  router.get('/category/:category_id', isAuthenticated, async function(req, res) {
    const { category_id } = req.params
    const theVals = [parseInt(category_id, 10)]

    const queryString = `SELECT * FROM Products
                            WHERE category_id = $1`;
    
    try {
      const result = await db.query(queryString, theVals);

      if(result) {
        res.status(200).json(result.rows);
      } else {
        res.status(400).send();
      }   
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.post('/search', isAuthenticated, async (req, res) => {
    const { searchTerm } = req.body

    let queryString = `SELECT * FROM products
                        WHERE name LIKE '%${searchTerm}%'
                           OR description LIKE '%${searchTerm}%'`
                           
    try {
      const result = await db.query(queryString);

      if(result) {
        res.status(200).json(result.rows);
      } else {
        res.status(400).send();
      }   
    } catch(e) {
      res.status(400).send({message: e.message});
    }

  })
}
