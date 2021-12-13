const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const bcrypt = require('bcrypt');
const db = require('../db');

function initializePassport(app) {
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

    // Google strategy
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {            
            const googleId = profile.id;
            const displayName = profile.displayName;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            const image = profile.photos[0].value;

            var selectQuery = "SELECT * FROM users WHERE google_id = $1";
            var theSelectVals = [googleId];

            var insertQuery = `INSERT INTO users (user_name, password, google_id, google_display_name, google_first_name,
                                                 google_last_name, google_image)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
            var theInsertVals = [displayName, googleId, googleId, displayName, firstName, lastName, image];

            try {
                let user = await db.query(selectQuery, theSelectVals); 

                if(user.rowCount === 1) {
                    return done(null, user.rows[0]);
                } else {
                    let user = await db.query(insertQuery, theInsertVals);
                    return done(null, user.rows[0]);
                }
            } catch (e) {
                console.error(e);
            }
        }
    )); // end Google strategy
} // end initializePassport

function isAuthenticated(req, res, next) {  
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    } 
  }

module.exports = {
    initializePassport,
    isAuthenticated
}