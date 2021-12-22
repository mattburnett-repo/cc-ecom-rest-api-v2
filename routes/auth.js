var express = require('express');
var router = express.Router();

var passport = require('passport');

const bcrypt = require('bcrypt');
var db = require('../db');

module.exports = (app) => {
    app.use('/', router);
    app.use('/login', router);

    router.get('/', (req, res) => res.render('login.ejs'));

    // routes for auth from api server
    router.post('/', passport.authenticate('local', {
        successRedirect: '/api/v1/api-docs', // api-docs is the front end for the API project
        failureRedirect: '/login',
        failureFlash: true
    }));    

    router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

    router.get('/auth/google/callback',  passport.authenticate('google', {
                failureRedirect: '/login' 
            }), (req, res) => {
                res.redirect('/api/v1/api-docs');
            });

    // routes for auth from React app server
    router.post('/api/v1/auth/local', passport.authenticate('local', {
        successRedirect: '/dashboard', 
        failureRedirect: '/login',
        failureFlash: true
    }));    

    // TODO: implement this, use passport
    // router.get('/api/v1/auth/google', (req, res) => {
    //     let msg = 'GET /api/v1/auth/google'
    //     console.log({msg});
    //     res.status(200).send({ message: msg})
    // })
    // router.get('/api/v1/auth/google/callback', (req, res) => {
    //     let msg = 'GET /api/v1/auth/google/callback'
    //     console.log({msg});
    //     res.status(200).send({ message: msg})
    // })
}