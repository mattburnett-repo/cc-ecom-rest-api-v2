var express = require('express');
var router = express.Router();

var passport = require('passport');
var jwt = require('jsonwebtoken')

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

    // API access from non-api server/s, ie React UI client.
    router.post('/api/v1/auth/local', function (req, res, next) {
        passport.authenticate('local', {session: false}, (err, user, info) => {
            // if (err || !user) {
            //     return res.status(400).json({
            //         message: 'error in /api/v1/auth/local',
            //         user: user
            //     });
            // }
            if (err) {
                return res.status(400).json({
                    message: 'error in /api/v1/auth/local',
                    // user: user
                });
            }
            if (!user) {
                return res.status(401).json({
                    message: '/api/v1/auth/local: user not authorized',
                    // user: user
                });
            }
           req.login(user, {session: false}, (err) => {
               if (err) {
                   res.send(err);
               }
               // generate a signed json web token with the contents of user object and return it in the response
               const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
               return res.json({user, token});
            });
        })(req, res);
    });

    // API JWT
    // app.post('/api/v1/auth/local', passport.authenticate('jwt', { session: false }),
    //     function(req, res) {
    //         res.send(req.user.profile);
    //     }
    // );

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