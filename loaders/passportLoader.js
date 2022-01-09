const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const JWTStrategy = require('passport-jwt').Strategy,
       ExtractJWT = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;
opts.issuer = 'localhost:4000';
opts.audience = 'localhost:3000';

// FIXME: at this point we are sort of ignoring passport...
var jwt = require('jsonwebtoken')

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

    // JWT Strategy. More or less ignoring it, using jwt verify in isAuthenticated(), below...
    // https://www.youtube.com/watch?v=Ne0tLHm1juE&list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK&index=10&t=972s
    // passport.use(new JWTStrategy({ // FIXME: should use opts{}, from upstairs?
    //         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //         secretOrKey: process.env.ACCESS_TOKEN_SECRET
    //     },

    // TODO: I don't understand why this is so complicated. Maybe fix / implement this later.
    //  https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314
    // passport.use(new JWTStrategy( opts,
    //     // function (jwtPayload, cb) {
    //     (jwtPayload, cb) => {
    //         // TODO: get this working / validating
    //         console.log('passportLoader JWTStrategy callback')
    //         //find the user in db if needed. 
    //         //      >>> This functionality may be omitted if you store everything you'll need in JWT payload. <<<
    //         // return UserModel.findOneById(jwtPayload.id)
    //         //     .then(user => {
    //         //         return cb(null, user);
    //         //     })
    //         //     .catch(err => {
    //         //         return cb(err);
    //         //     });
    //     }
    // ));
    // end JWT Strategy
} // end initializePassport

function isAuthenticated(req, res, next) {   
    if(req.isAuthenticated()) { 
        ('req.isAuthenticate()')
        return next();
    } else if (req.headers['authorization']) { 
        const authHeader = req.headers['authorization']
        const authToken =  authHeader && req.headers['authorization'].split(' ')[1]

        if(authToken == null) {
            console.log('authToken error in jwt verify: Token not present')
            return res.sendStatus(401)
        }

        // console.log('start jwt')
        // TODO: I don't understand why passport makes this so complicated. Maybe fix / implement this later.
        //      Right now, we have working JWT starting at jwt.verify()
        // passport.authenticate('jwt', {session: false})
        
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                res.status(401).send({message: 'Authentication error: Token not recognized'})
            }

            req.user = user

            next()
        })

        // console.log('end jwt')

        // return next()
    } else {
        res.status(401).send({message: 'no authorized user'})

        // res.redirect('/login'); // FIXME
    } 
  }

module.exports = {
    initializePassport,
    isAuthenticated
}