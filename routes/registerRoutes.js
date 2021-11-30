var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var db = require('../db');

// https://www.youtube.com/watch?v=-RCnNyD0L-s

router.get('/', function(req, res) {
    res.render('register.ejs', {name: 'qwer'});
})

router.post('/', async function(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const theVals = [req.body.username, hashedPassword];

        const queryString = 'INSERT INTO users(user_name, password) VALUES ($1, $2) RETURNING *';
        const result = db.query(queryString, theVals);
 
        // TODO: needs to catch duplicate user names. Right now it fails silently
        res.redirect('/login'); // , { message: `User ${user_name} already exists`}
    } catch {
        res.redirect('/register');
    }
})

module.exports = router;