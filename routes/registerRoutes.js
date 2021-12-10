var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var db = require('../db');

// https://www.youtube.com/watch?v=-RCnNyD0L-s

module.exports = async (app) => {
    app.use('/register', router);
    app.use('/api/v1/register', router);

    router.get('/', function(req, res) {
        res.render('register.ejs');
    })

    router.post('/', async function(req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const theVals = [req.body.username, hashedPassword, req.body.email];

            const queryString = 'INSERT INTO users(user_name, password, email) VALUES ($1, $2, $3) RETURNING *';
            const result = db.query(queryString, theVals);
    
            // TODO: needs to catch duplicate user names. Right now it fails silently
            res.redirect('/login'); // , { message: `User ${user_name} already exists`}
        } catch {
            res.redirect('/register');
        }
    })
}
