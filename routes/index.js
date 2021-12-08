// var express = require('express');
// const app = require('../app');
// var router = express.Router();

// module.exports = async (app) => {
//   app.use('/', router);

//   router.get('/', function(req, res, next) {
//     // res.render('index', { title: 'Express' });
//     res.render('index');
//   });
// }
/* GET home page. */


// module.exports = router;

// const authRouter = require('./auth');
const cartRouter = require('./cartRoutes');
const loginRouter = require('./loginRoutes');
const orderRouter = require('./orderRoutes');
const productRouter = require('./productRoutes');
const registerRouter = require('./registerRoutes');
const userRouter = require('./userRoutes');

module.exports = (app, passport) => {
  // authRouter(app, passport); // TODO: finish refactor of route auth
  cartRouter(app);
  loginRouter(app);
  orderRouter(app);
  productRouter(app);
  registerRouter(app);
  userRouter(app);
}