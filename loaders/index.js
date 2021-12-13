const expressLoader = require('./expressLoader');
const { passportLocalStrategy, passportGoogleStrategy }  = require('./passportLoader');
const routeLoader = require('../routes');
const swaggerLoader = require('./swaggerLoader');

module.exports = async (app) => {
    const expressApp = await expressLoader(app);
    let passport = await passportLocalStrategy(expressApp);
    // const passport = await passportGoogleStrategy(expressApp);
    passport = await passportGoogleStrategy(expressApp);

    await routeLoader(app, passport); 
    await swaggerLoader(app);

    // Error Handler
    app.use((err, req, res, next) => {
        const { message, status } = err;

        return res.status(status).send({ message });
    });
}