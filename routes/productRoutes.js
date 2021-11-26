var express = require('express');
var router = express.Router();

var db = require('../db');

router.get('/', async function(req, res, next) {
  const queryString = "SELECT * FROM Products";
  const result = await db.query(queryString);

  if(result) {
    res.status(200).send(result.rows);
  } else {
    res.status(400).send();
  }
});

router.get('/:id', async function(req, res, next) {
  const id = [parseInt(req.params.id)];
  const queryString = "SELECT * FROM Products WHERE id = $1";
  const result = await db.query(queryString, id);

  if(result.rowCount > 0) {
    res.status(200).send(result.rows); 
  } else if (result.rowCount === 0) {
    res.status(204).send();
  } else {
    res.status(400).send();
  }
});

router.post('/', async function(req, res, next) {
  var theVals = [req.body.id, req.body.name, req.body.description, req.body.price];
 
  const queryString = 'INSERT INTO products(id, name, description, price) VALUES($1, $2, $3, $4) RETURNING *';
  const result = await db.query(queryString, theVals);

  if(result) {
    res.status(201).send(result.rows); 
  } else {
    res.status(400).send();
  }
});

router.put('/:id', async function(req, res, next) {
  var theVals = [req.params.id, req.body.name, req.body.description, req.body.price];

  const queryString = 'UPDATE Products SET name = $2, description = $3, price = $4  WHERE id = $1 RETURNING *';
  const result = await db.query(queryString, theVals);

  if(result.rowCount > 0) {
    res.status(205).send(result.rows); 
  } else if (result.rowCount === 0) {
    res.status(204).send();
  } else {
    res.status(400).send();
  }
});

router.delete('/:id', async function(req, res, next) {
  var theVals = [req.params.id];

  const queryString = "DELETE FROM products WHERE id = $1";
  const result = await db.query(queryString, theVals);

  if(result) {
    res.status(204).send(result.rows); 
  } else {
    res.status(400).send();
  }
});

module.exports = router;
