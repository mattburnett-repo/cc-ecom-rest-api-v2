var express = require('express');
var router = express.Router();

var passport = require('passport');

module.exports = (app) => {
    app.use('/', router);
    app.use('/login', router);

    router.get('/', (req, res) => res.render('login.ejs'));

    router.post('/', passport.authenticate('local', {
        successRedirect: '/api-docs', // api-docs is the front end for this project
        failureRedirect: '/login',
        failureFlash: true
    }));    

    router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

    router.get('/auth/google/callback',  passport.authenticate('google', { // FIXME: works on localhost, but on prod it returns login screen
        failureRedirect: '/login' 
    }), (req, res) => {
        res.redirect('/api-docs');
    });

}