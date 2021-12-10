var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = async (app) => {
  app.use('/api/v1/user', router);

  router.get('/', isAuthenticated, async function(req, res) {
    try {
      const queryString = "SELECT * FROM Users";
      const result = await db.query(queryString);

      if(result.rowCount > 0) {
        res.status(200).send(result.rows);
      } else if(result.rowCount === 0) {
        res.status(204).send();
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }

  });

  router.get('/:user_id', isAuthenticated, async function(req, res) {
    try {
      const { user_id } = req.params;

      const queryString = "SELECT * FROM Users WHERE id = $1";
      const result = await db.query(queryString, [parseInt(user_id, 10)]);

      if(result.rowCount > 0) {
        res.status(200).send(result.rows); 
      } else if (result.rowCount === 0) {
        res.status(200).send([{"message": `user id ${user_id} not found`}]);
      } else {
        res.status(400).send();
      }     
    } catch(e) {
      res.status(400).send({message: e.message});
    }

  });

  router.post('/', isAuthenticated, async function(req, res) {
    try {
      const { username, password, email } = req.body;
      var theVals = [username, password, email];
    
      const queryString = 'INSERT INTO users(user_name, password, email) VALUES($1, $2, $3) RETURNING *';
      const result = await db.query(queryString, theVals);

      if(result) {
        res.status(200).send(result.rows); 
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.put('/', isAuthenticated, async function(req, res) {
    try {
      const { user_id, username, password, email } = req.body;
      var theVals = [parseInt(user_id, 10), username, password];

      const queryString = 'UPDATE users SET user_name = $2, password = $3, email = $4 WHERE id = $1 RETURNING *';
      const result = await db.query(queryString, theVals);

      if(result.rowCount > 0) {
        res.status(200).send(result.rows); 
      } else if (result.rowCount === 0) {
        res.status(204).send({message: `user ${username} not updated`});
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });

  router.delete('/', isAuthenticated, async function(req, res) {
    try {
      const { user_id } = req.body;
      var theVals = [parseInt(user_id, 10)];

      const queryString = "DELETE FROM users WHERE id = $1";
      const result = await db.query(queryString, theVals);

      if(result) {
        res.status(200).send(result.rows); 
      } else {
        res.status(400).send();
      }    
    } catch(e) {
      res.status(400).send({message: e.message});
    }
  });
}

