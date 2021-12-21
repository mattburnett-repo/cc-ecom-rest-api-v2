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

    // routes for auth from app server
    // FIXME: this needs to be refactored into a model or something, and should use passport
    // just copy local, above, and change path / redirects?
    // router.post('/api/v1/auth/local', passport.authenticate('local', {
    //     successRedirect: '/dashboard', 
    //     failureRedirect: '/login',
    //     failureFlash: true
    // }));    

    router.post('/api/v1/auth/local', async (req, res) => {
        // body / header: application/x-www-form-urlencoded
        const {username, password } = req.body

        let msg = 'POST /api/v1/auth/local username: ' + username + ' password: ' + password
        console.log({msg});

        var theVals = [username]
        var queryString = 'SELECT * FROM users WHERE user_name = $1'

        const user = await db.query(queryString, theVals)

        if(user.rowCount !== 1) {
            res.status(401).send({ message: `User ${username} not found or not authorized` });
            return;
        }

        try {   
            if(await bcrypt.compare(password, user.rows[0].password)) {
                res.status(200).send(user.rows);
            } else {
                res.status(401).send({ message: `user ${username} not authorized` });
            }
        } catch (e) {
            res.status(400).send({ message: e.message });
        }
    }) // end post auth/local

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