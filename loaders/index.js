const expressLoader = require('./expressLoader');
const swaggerLoader = require('./swaggerLoader');

module.exports = async (app) => {
    const expressApp = await expressLoader(app);

    // await swaggerLoader(app);

    // return expressApp;

    // Error Handler
    app.use((err, req, res, next) => {
        const { message, status } = err;

        return res.status(status).send({ message });
    });
}