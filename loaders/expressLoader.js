var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

// CORS docs: https://expressjs.com/en/resources/middleware/cors.html
var cors = require('cors');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('express-flash');
var session = require('express-session');
var methodOverride = require('method-override');

var expressLayouts = require('express-ejs-layouts');
var partials = require('express-partials');

module.exports = (app) => {
    const corsOptions = {
        origin: process.env.REACT_APP_APP_BASE_URL,
        credentials: true

        // stripe-related. maybe don't need
        // https://blog.logrocket.com/react-stripe-payment-system-tutorial/
        // res.header('Access-Control-Allow-Origin', '*')
        // res.header(
        //   'Access-Control-Allow-Headers',
        //   'Origin, X-Requested-With, Content-Type, Accept'
        // )
      };

    app.use(cors(corsOptions));

    app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, '../public')));
    app.use(methodOverride('_method'));

    app.set("trust proxy", 1);

    app.use(session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            // sameSite: 'none',
            // secure: true,
        },
        resave: true,
        saveUninitialized: false
    }));

    app.use(flash());

    // Global vars
    // elsehere in the app: req.flash('the_message_type', 'the_message_text')
    // res.render('template_to_render', {var_to_display: val_to_display})
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');

        next();
    })

    app.use(expressLayouts);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    app.use(partials());
    
    return app;
}