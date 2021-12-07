// git push heroku main

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require('express');
var app = express();

const loaders = require('./loaders');

loaders(app); // TODO: need to add swagger / passport / routing

// stuff for swagger
var path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs'); 
// const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, './swagger.yml'), 'utf8'));
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, './openapi.yml'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// stuff for passport
var bcrypt = require('bcrypt');
const { initializePassport, isAuthenticated, isNotAuthenticated } = require('./passport-config');

const passport = require('passport');
initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

var index = require('./routes/index');
var loginRoutes = require('./routes/loginRoutes');
var registerRoutes = require('./routes/registerRoutes');
var userRoutes = require('./routes/userRoutes');
var productRoutes = require('./routes/productRoutes');
var cartRoutes = require('./routes/cartRoutes');
var orderRoutes = require('./routes/orderRoutes');

// app.use('/', index);
// app.use('/api/v1', index);

// app.use(isNotAuthenticated);

app.use('/', loginRoutes);
app.use('/api/v1', loginRoutes);
app.use('/login', loginRoutes);
app.use('/api/v1/login', loginRoutes);
app.use('/logout', loginRoutes);
app.use('/api/v1/logout', loginRoutes);

app.use('/register', registerRoutes);
app.use('/api/v1/register', registerRoutes);

app.use(isAuthenticated);

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);

// app.delete('/logout', (req, res) => {
//   req.logOut();
//   res.redirect('/login');
// })

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