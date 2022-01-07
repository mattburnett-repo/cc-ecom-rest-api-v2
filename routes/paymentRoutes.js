
var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = (app) => {
    app.use('/api/v1/payment', router)

    // get all payments
    router.get('/', isAuthenticated, async (req, res) => {
        const queryString = "SELECT * FROM payments"

        try {
             const result = await db.query(queryString)

             res.status(200).send(result.rows) 
        } catch(err) {
            console.log("Error in payment routes get all ", err)
            res.status(400).send('Error in paymentRoutes / get all: ' + err)
        }       
    }) // end get all

    // get payment info by payment id 
    router.get('/:paymentId', isAuthenticated, async (req, res) => {
        const paymentId = parseInt(req.params.paymentId, 10)

        const queryString = "SELECT * FROM payments WHERE id = $1"

        try {
             const result = await db.query(queryString, [paymentId])

             res.status(200).send(result.rows) 
        } catch(err) {
            console.log("Error in payment routes get by payment id ", err)
            res.status(400).send('Error in paymentRoutes / get by payment id: ' + err)
        }       
    }) // end get by payment id

    // get payment info by user id 
    router.get('/user/:userId', isAuthenticated, async (req, res) => {
        const userId = parseInt(req.params.userId, 10)

        const queryString = "SELECT * FROM payments WHERE user_id = $1"

        try {
            const result = await db.query(queryString, [userId])

            res.status(200).send(result.rows) 
        } catch(err) {
            console.log("Error in payment routes get by user id ", err)
            res.status(400).send('Error in paymentRoutes / get by user id: ' + err)
        }   
    }) // end get by user id

    // stripe payment
    router.post('/stripe/charge', isAuthenticated, async (req, res) => {
        const { amount, source, receipt_email } = req.body

        try {
            const charge = await stripe.charges.create({
                amount: amount,
                currency: 'usd',
                source: source,
                receipt_email: receipt_email
            })

            if (!charge) throw new Error('charge unsuccessful')

            res.status(200).json({
                charge,
                message: 'charge posted successfully'
            })
        } catch (error) {
            console.log('error ', error)
            res.status(500).json({
                message: error.message
            })
        } // end try / catch
    }) // end stripe payment
    
} // end module.exports