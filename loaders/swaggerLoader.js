var path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs'); 

// const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, './swagger.yml'), 'utf8'));
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, '../openapi.yml'), 'utf8'));

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    return app;
}
