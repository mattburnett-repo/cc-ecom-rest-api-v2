var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
    app.use('/api/v1/product-category', router);

    router.get('/', isAuthenticated, async function(req, res) {
        const queryString = `SELECT category_id, description 
                               FROM product_categories
                           ORDER BY description`;

        try {
            const result = await db.query(queryString);

            if(result) {
                res.status(200).json(result.rows);
            }
        } catch (e) {
            res.status(400).send();
        }
    }); // end get

    router.get('/:category_id', isAuthenticated, async function(req, res) {
        const queryString = `SELECT * FROM product_categories
                                    WHERE category_id = $1
                                  ORDER BY description`;
        const { category_id } = req.params;
        const theVals = [parseInt(category_id, 10)]

        try {
            const result = await db.query(queryString, theVals);

            if(result) {
                res.status(200).send(result.rows);
            }
        } catch (e) {
            res.status(400).send();
        }
    }); // end get
} // end module.exports