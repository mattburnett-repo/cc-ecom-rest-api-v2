const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const bcrypt = require('bcrypt');
const db = require('../db');

function passportLocalStrategy(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    // Set method to serialize data to store in cookie
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    // Set method to deserialize data stored in cookie and attach to req.user
    passport.deserializeUser((id, done) => {
        done(null, { id });
    });

    // Local strategy
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            const theVals = [username];
            const queryString = 'SELECT * FROM users WHERE user_name = $1';
            const user = await db.query(queryString, theVals);
            
            if(user.rowCount !== 1) {
                return done(null, false, { message: `${username} not found. You can click the Register link and create a login from there.`});
            }

            try {
                if(await bcrypt.compare(password, user.rows[0].password)) {
                    return done(null, user.rows[0]);
                } else {
                    return done(null, false, { message: 'Password incorrect'});
                }
            } catch (e) {
                return done(e)
            }
        })   
    ); // end local strategy

    // Google OAuth strategy
    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.

    // passport.use(new GoogleStrategy({
    //         clientID: process.env.GOOGLE_CLIENT_ID,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //         callbackURL: process.env.GOOGLE_CALLBACK_URL
    //     },
    //     function(accessToken, refreshToken, profile, done) {
    //         User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //             return done(err, user);
    //         });
    //     }
    // )); // end Google strategy

    return passport;
}

function isAuthenticated(req, res, next) {  
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    } 
  }

module.exports = {
    passportLocalStrategy,
    isAuthenticated
}