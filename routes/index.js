const authRouter = require('./auth');
const cartRouter = require('./cartRoutes');
const orderRouter = require('./orderRoutes');
const productRouter = require('./productRoutes');
const productCategoryRouter = require('./productCategoryRoutes');
const registerRouter = require('./registerRoutes');
const userRouter = require('./userRoutes');


  module.exports = (app) => {
  authRouter(app);
  registerRouter(app);
  cartRouter(app);
  orderRouter(app);
  productRouter(app);
  productCategoryRouter(app);
  userRouter(app);
}