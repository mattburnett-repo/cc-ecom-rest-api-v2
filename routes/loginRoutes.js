var express = require('express');
var router = express.Router();

var passport = require('passport');

// https://www.youtube.com/watch?v=-RCnNyD0L-s

router.get('/', function(req, res) {
    try {
        res.render('login.ejs');
    } catch (e) {
        res.status(400).send({message: e.message});
    }
    
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/api-docs', // api-docs is the front end for this project
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;