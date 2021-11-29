
// git push heroku main

require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// stuff for swagger
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs'); 
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, './swagger.yml'), 'utf8'));

// stuff for passport
var bcrypt = require('bcrypt');
var flash = require('express-flash');
var session = require('express-session');

var app = express();

const initializePassport = require('./passport-config');
const passport = require('passport');
initializePassport(passport);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public/images', 'ladderIcon_01.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ extended: false }));

app.use(flash());

var index = require('./routes/index');
var loginRoutes = require('./routes/loginRoutes');
var registerRoutes = require('./routes/registerRoutes');
var userRoutes = require('./routes/userRoutes');
var productRoutes = require('./routes/productRoutes');
var cartRoutes = require('./routes/cartRoutes');
var orderRoutes = require('./routes/orderRoutes');

// app.use('/', index);
// app.use('/api/v1', index);
app.use('/', loginRoutes);
app.use('/api/v1', loginRoutes);
app.use('/login', loginRoutes);
app.use('/api/v1/login', loginRoutes);

app.use('/register', registerRoutes);
app.use('/api/v1/register', registerRoutes);

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
