const expressLoader = require('./expressLoader');
const { passportLocalStrategy }  = require('./passportLoader');
const routeLoader = require('../routes');
const swaggerLoader = require('./swaggerLoader');

module.exports = async (app) => {
    const expressApp = await expressLoader(app);
    const passport = await passportLocalStrategy(expressApp);

    await routeLoader(app, passport); 
    await swaggerLoader(app);

    // Error Handler
    app.use((err, req, res, next) => {
        const { message, status } = err;

        return res.status(status).send({ message });
    });
}