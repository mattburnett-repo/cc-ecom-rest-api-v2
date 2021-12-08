var express = require('express');
var router = express.Router();

var passport = require('passport');

// https://www.youtube.com/watch?v=-RCnNyD0L-s

module.exports = (app) => {
    app.use('/', router);
    app.use('/api/v1', router);
    app.use('/login', router);
    app.use('/api/v1/login', router);
    app.use('/logout', router);
    app.use('/api/v1/logout', router); 

    router.get('/', function(req, res) {
        res.render('login.ejs');
    });

    router.post('/', passport.authenticate('local', {
        successRedirect: '/api-docs', // api-docs is the front end for this project
        failureRedirect: '/login',
        failureFlash: true
    }));
}