const authRouter = require('./auth');
const cartRouter = require('./cartRoutes');
const orderRouter = require('./orderRoutes');
const productRouter = require('./productRoutes');
const registerRouter = require('./registerRoutes');
const userRouter = require('./userRoutes');

  module.exports = (app) => {
  authRouter(app);
  cartRouter(app);
  orderRouter(app);
  productRouter(app);
  registerRouter(app);
  userRouter(app);
}