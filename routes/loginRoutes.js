var express = require('express');
var router = express.Router();

var passport = require('passport');

// https://www.youtube.com/watch?v=-RCnNyD0L-s

router.get('/', function(req, res) {
    res.render('login.ejs');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/api-docs', // TODO: api-docs is kind of like the front end. you should be able to interact with the api here.
    failureRedirect: '/login',
    failureFlash: true
}));

// TODO: add middleware methods to check isAuthenticated true / false and use to restrict access to routes

module.exports = router;