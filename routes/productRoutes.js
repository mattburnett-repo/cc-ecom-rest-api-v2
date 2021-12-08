var express = require('express');
var router = express.Router();

var db = require('../db');

module.exports = async (app) => {
  app.use('/api/v1/product', router);

  router.get('/', async function(req, res, next) {
    try {
      const queryString = "SELECT * FROM Products";
      const result = await db.query(queryString);

      if(result) {
        res.status(200).send(result.rows);
      } else {
        res.status(400).send();
      }   
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.get('/:id', async function(req, res, next) {
    try {
      const id = [parseInt(req.params.id)];
      const queryString = "SELECT * FROM Products WHERE id = $1";
      const result = await db.query(queryString, id);

      if(result.rowCount > 0) {
        res.status(200).send(result.rows); 
      } else if (result.rowCount === 0) {
        res.status(200).send([{'message': `product id ${req.params.id} not found`}]);
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.post('/', async function(req, res, next) {
    try {
      var theVals = [req.body.name, req.body.description, req.body.price];

      const queryString = 'INSERT INTO products(name, description, price) VALUES($1, $2, $3) RETURNING *';
      const result = await db.query(queryString, theVals);

      if(result) {
        res.status(201).send(result.rows); 
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.put('/', async function(req, res, next) {
    try {
      var theVals = [parseInt(req.body.id), req.body.name, req.body.description, req.body.price];

      const queryString = 'UPDATE Products SET name = $2, description = $3, price = $4  WHERE id = $1 RETURNING *';
      const result = await db.query(queryString, theVals);

      if(result.rowCount === 1) {
        res.status(200).send(result.rows); 
      } else if (result.rowCount === 0) {
        res.status(204).send();
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.delete('/:id', async function(req, res, next) {
    try {
      var theVals = [parseInt(req.params.id)];

      const queryString = "DELETE FROM products WHERE id = $1";
      const result = await db.query(queryString, theVals);
      // TODO: find out about that results.rows?.length thing and fix all routes to use/return this
      if(result) {
        res.status(204).send(result.rows); 
      } else {
        res.status(400).send();
      }   
    } catch(e) {
      res.status(400).send({message: e.message});
    } 
  });
}
