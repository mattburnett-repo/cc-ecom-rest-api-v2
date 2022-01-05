
var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

const postCharge = require('../loaders/stripe')

module.exports = (app) => {
    app.use('/api/v1/payment', router)

    // add payment info by user id ENCRYPT CC NUMS
    router.post('/', isAuthenticated, async(req, res) => {
        const { userId, nameOnCard, paymentTypeId, cardNumber, expDate, orderAmount} = req.body
        const hashedCardNumber = await bcrypt.hash(cardNumber, 10)
        const thePaymentInsertVals = [ userId, nameOnCard, paymentTypeId, hashedCardNumber, expDate, orderAmount ]

        const paymentInsertQueryString = 
                        `INSERT INTO payments
                            (user_id, name_on_card, payment_type_id, card_number, expiration_date, amount)
                            VALUES ($1, $2, $3, $4, $5, $6)
                         RETURNING *`

        try { 
            const paymentInsertResult = await db.query(paymentInsertQueryString, thePaymentInsertVals)
            const paymentInsertId = paymentInsertResult.rows[0].id

            const usersPaymentsInsertQueryString = `INSERT INTO users_payments(user_id, payment_id)
                                                         VALUES ($1, $2)`
            const theUsersPaymentsInsertVals = [userId, paymentInsertId]
            const usersPaymentsInsertResult = await db.query(usersPaymentsInsertQueryString, theUsersPaymentsInsertVals)
        
            res.status(200).send("200 in paymentRoutes / post") // TODO: remember that cc num is encrypted
        } catch(err) {
            console.log("Error in payment routes post ", err)
            res.status(400).send('Error in paymentRoutes / post: ' + err)
        }
    }) // end post

    // get all payments DECRYPT CC NUMS
    router.get('/', isAuthenticated, async (req, res) => {
        const queryString = "SELECT * FROM payments"

        try {
             const result = await db.query(queryString)

             res.status(200).send(result.rows) // TODO: remember that cc nums are encrypted
        } catch(err) {
            console.log("Error in payment routes get all ", err)
            res.status(400).send('Error in paymentRoutes / get all: ' + err)
        }       
    }) // end get all

    // get payment info by payment id DECRYPT CC NUMS
    router.get('/:paymentId', isAuthenticated, async (req, res) => {
        const paymentId = parseInt(req.params.paymentId, 10)

        const queryString = "SELECT * FROM payments WHERE id = $1"

        try {
             const result = await db.query(queryString, [paymentId])

             res.status(200).send(result.rows) // TODO: remember that cc nums are encrypted
        } catch(err) {
            console.log("Error in payment routes get by payment id ", err)
            res.status(400).send('Error in paymentRoutes / get by payment id: ' + err)
        }       
    }) // end get by payment id

    // get payment info by user id DECRYPT CC NUMS
    router.get('/user/:userId', isAuthenticated, async (req, res) => {
        const userId = parseInt(req.params.userId, 10)

        const queryString = "SELECT * FROM payments WHERE user_id = $1"

        try {
            const result = await db.query(queryString, [userId])

            res.status(200).send(result.rows) // TODO: remember that cc nums are encrypted
        } catch(err) {
            console.log("Error in payment routes get by user id ", err)
            res.status(400).send('Error in paymentRoutes / get by user id: ' + err)
        }   
    }) // end get by user id

    // get payment types 
    router.get('/type', isAuthenticated, async (req, res) => {
        const queryString = "SELECT * FROM payment_types"

        try {
             const result = await db.query(queryString)

             res.status(200).send(result.rows) // TODO: remember that cc nums are encrypted
        } catch(err) {
            console.log("Error in payment routes get payment types ", err)
            res.status(400).send('Error in paymentRoutes / get payment types: ' + err)
        }       
    }) // end get all

    // stripe payment
    router.post('/stripe/charge', isAuthenticated, postCharge)
    
} // end module.exports