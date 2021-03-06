const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

function initializePassport(passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            const theVals = [username];
            const queryString = 'SELECT * FROM users WHERE user_name = $1';
            const user = await db.query(queryString, theVals);
            
            if(user.rowCount !== 1) {
                return done(null, false, { message: `${username} not found`});
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

    // Set method to serialize data to store in cookie
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    // Set method to deserialize data stored in cookie and attach to req.user
    passport.deserializeUser((id, done) => {
        done(null, { id });
    });
}

function isAuthenticated(req, res, next) {  
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    } 
  }

function isNotAuthenticated(req, rest, next) { // TODO: untangle this, so we can give users a logout option
    if(req.isAuthenticated()) {
        return res.redirect('/logout');
    } else {
        return next();
    }    
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    initializePassport
}
