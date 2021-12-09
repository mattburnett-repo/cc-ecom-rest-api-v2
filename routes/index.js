const authRouter = require('./auth');
const cartRouter = require('./cartRoutes');
const orderRouter = require('./orderRoutes');
const productRouter = require('./productRoutes');
const registerRouter = require('./registerRoutes');
const userRouter = require('./userRoutes');

module.exports = (app, passport) => {
  authRouter(app, passport);  
  cartRouter(app);
  orderRouter(app);
  productRouter(app);
  registerRouter(app);
  userRouter(app);
}