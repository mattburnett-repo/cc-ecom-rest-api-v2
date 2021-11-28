var express = require('express');
var router = express.Router();

var db = require('../db');

router.get('/', async function(req, res, next) {
  const queryString = "SELECT * FROM Users";
  const result = await db.query(queryString);

  if(result) {
    res.status(200).send(result.rows);
  } else {
    res.status(400).send();
  }
});

router.get('/:id', async function(req, res, next) {
  const id = [parseInt(req.params.id)];

  const queryString = "SELECT * FROM Users WHERE id = $1";
  const result = await db.query(queryString, id);

  if(result.rowCount > 0) {
    res.status(200).send(result.rows); 
  } else if (result.rowCount === 0) {
    res.status(200).send([{"message": `user id ${req.params.id} not updated`}]);
  } else {
    res.status(400).send();
  }
});

router.post('/', async function(req, res, next) {
  var theVals = [req.body.id, req.body.user_name, req.body.password];
 
  const queryString = 'INSERT INTO users(id, user_name, password) VALUES($1, $2, $3) RETURNING *';
  const result = await db.query(queryString, theVals);

  if(result) {
    res.status(201).send(result.rows); 
  } else {
    res.status(400).send();
  }
});

router.put('/:id', async function(req, res, next) {
  var theVals = [req.params.id, req.body.user_name, req.body.password];

  const queryString = 'UPDATE users SET user_name = $2, password = $3 WHERE id = $1 RETURNING *';
  const result = await db.query(queryString, theVals);

  if(result.rowCount > 0) {
    res.status(200).send(result.rows); 
  } else if (result.rowCount === 0) {
    res.status(204).send({message: `user ${req.body.user_name} not updated`});
  } else {
    res.status(400).send();
  }
});

router.delete('/:id', async function(req, res, next) {
  var theVals = [req.params.id];

  const queryString = "DELETE FROM users WHERE id = $1";
  const result = await db.query(queryString, theVals);

  if(result) {
    res.status(200).send(result.rows); 
  } else {
    res.status(400).send();
  }
});

module.exports = router;
