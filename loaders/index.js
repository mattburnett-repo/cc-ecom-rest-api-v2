const expressLoader = require('./expressLoader');
const swaggerLoader = require('./swaggerLoader');
// const passportLoader = require('./passportLoader');

module.exports = async (app) => {
    const expressApp = await expressLoader(app);
    
    // const passport = await passportLoader(expressApp);

    // await swaggerLoader(app);

    // return expressApp;

    // Error Handler
    app.use((err, req, res, next) => {
        const { message, status } = err;

        return res.status(status).send({ message });
    });
}