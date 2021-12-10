var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('express-flash');
var session = require('express-session');
var methodOverride = require('method-override');

var expressLayouts = require('express-ejs-layouts');
var partials = require('express-partials');

module.exports = (app) => {
    app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(methodOverride('_method'));

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));

    app.use(flash());

    // Global vars
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