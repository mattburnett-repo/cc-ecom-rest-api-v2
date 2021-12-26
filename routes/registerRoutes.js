var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var db = require('../db');

// https://www.youtube.com/watch?v=-RCnNyD0L-s
// https://youtu.be/6FOq4cUdH8k

module.exports = async (app) => {
    app.use('/register', router);
    app.use('/api/v1/register', router);

    router.get('/', function(req, res) {
        res.render('register.ejs');
    })

    router.post('/', async function(req, res) {
        const { username, password, password2, email } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const theVals = [username, hashedPassword, email];

        const queryString = 'INSERT INTO users(user_name, password, email) VALUES ($1, $2, $3) RETURNING *';

        try {
            const result = await db.query(queryString, theVals)
            
            // FIXME: needs to redirect / send message / reroute instead, with 200 code or whatever and then log user in
            res.render('login'); 

            // res.status(200).send(result)
          } catch (err) {
            let errors = []
            errors.push({ msg: `Username ${username} already exists.`})
            res.render('register', {errors})
          }

    })
}
