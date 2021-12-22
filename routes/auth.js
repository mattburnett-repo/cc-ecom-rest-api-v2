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

    // routes for auth from React app server. write a custom callback to make it work.
    // FIXME: does this actually create / pass isAuthenticated() readable... 'thing'?
    router.post('/api/v1/auth/local', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => { // FIXME: handle other return codes / err / info
            if(!user) {
                res.status(401).json({message: 'user is not authorized'})
            } else {
                res.status(200).json(user)
            }
        })(req, res, next)
    });

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