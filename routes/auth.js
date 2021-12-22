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
    // router.post('/api/v1/auth/local', passport.authenticate('local', {
    //     successRedirect: '/dashboard', // FIXME: add this route on the app side
    //     failureRedirect: '/login',
    //     failureFlash: true
    // }));    

    // FIXME: there should be some kind of token thing that is used for every subsequent request
    router.post('/api/v1/auth/local', async (req, res) => {
        const { username, password } = req.body;

        const theVals = [username];
        const queryString = 'SELECT * FROM users WHERE user_name = $1';
        const user = await db.query(queryString, theVals);
        
        if(user.rowCount !== 1) {
            res.status(401).send({ message: `${username} not found.`})
            return 
        }

        try {
            if(await bcrypt.compare(password, user.rows[0].password)) {
                res.status(200).send(user.rows[0])
                return 
            } else {
                res.status(401).send({ message: 'Password incorrect'})
                return 
            }
        } catch (e) {
            return done(e)
        }
    })

    router.get('/api/v1/test', (req, res) => {
        console.log('/api/v1/test')
        console.log('req.session: ' + req.session)
        console.log('req.session.cookie: ' + req.session.cookie)
        console.log('req.isAuthenticated(): ' + req.isAuthenticated())
        res.status(200).send({message: 'hello from api/v1/test'})
    })

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