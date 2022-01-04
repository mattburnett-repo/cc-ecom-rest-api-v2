
var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
    app.use('/api/v1/payment-type', router)

    // get payment types 
    router.get('/', isAuthenticated, async (req, res) => {
        const queryString = "SELECT * FROM payment_types"

        try {
             const result = await db.query(queryString)

             res.status(200).send(result.rows) // TODO: remember that cc nums are encrypted
        } catch(err) {
            console.log("Error in payment routes get payment types ", err)
            res.status(400).send('Error in paymentRoutes / get payment types: ' + err)
        }       
    }) // end get all
} // end module.exports