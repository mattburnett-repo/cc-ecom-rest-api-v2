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

    // routes for auth from React app server. wrote a custom callback in passport.authenticate() to make it work.
    // FIXME: does this actually create / pass isAuthenticated() readable... 'thing'?
    // router.post('/api/v1/auth/local', (req, res, next) => {
    //     passport.authenticate('local', (err, user, info) => { // FIXME: handle other return codes / err / info
    //         // FIXME: how do we pass back isAuthorized thing?
    //         if(!user) {
    //             res.status(401).json({message: 'user is not authorized'})
    //             return
    //         } else {
    //             // passport.serializeUser(user)
    //             res.status(200).json(user)
    //         }
            
    //         // console.log('auth/local ' + res.body)
    //         // console.log('auth/local req.isAuthenticated() ' + req.isAuthenticated())
    //     // })(req, res, next)   
    //     })(req, res, next)         
    // });


    router.post('/api/v1/auth/local', passport.authenticate('local'),
        (req, res) => {
            res.send({message: 'login', user: req.user})
        }
    );

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

    router.post('/api/v1/auth/logout', function(req, res){
        req.logout();
        // res.redirect('/');
        res.status(200).send({message: 'logout successful'});
    });
}