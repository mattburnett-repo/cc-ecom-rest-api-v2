
var express = require('express');
var router = express.Router();

var db = require('../db');
const { isAuthenticated } = require('../loaders/passportLoader');

module.exports = (app) => {
    app.use('/api/v1/address', router)

    router.post('/', isAuthenticated, async function(req, res) {
        const { userId, firstName, lastName, address1, address2, city, stateProvince, postalCode, country } = req.body; 
        const theAddressVals = [firstName, lastName, address1, address2, city, stateProvince, postalCode, country];

        try {
            // add address record
            // TODO: $1 is user id
            var addressQueryString = `INSERT INTO addresses(first_name, last_name, address_1, address_2, city, state_province, postal_code, country)
                                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
            var result = await db.query(addressQueryString, theAddressVals);
            var addressId = result.rows[0].id;

            // add record to associate user to address
            var theUserAddressVals = [parseInt(userId, 10), parseInt(addressId, 10)]
            var usersAddressesQueryString = `INSERT INTO users_addresses (user_id, address_id) VALUES ($1, $2) RETURNING *;`
            var usersAddressesResult = db.query(usersAddressesQueryString, theUserAddressVals)

            res.status(200).send(result.rows);
        } catch (e) {
            res.status(400).send({message: e.message}); 
        }
    }) // end post

    // get all
    router.get('/', isAuthenticated, async function(req, res) {
        const queryString = 'SELECT * FROM addresses'
        
        try {
            var result = await db.query(queryString)

            if(result) {
                res.status(200).send(result.rows);
            } else {
                res.status(400).send();
            }
        } catch(e) {
            res.status(400).send({message: e.message});
        }
    }) // end get all

    // get by id
    router.get('/:id', isAuthenticated, async function(req, res) {
        const addressId = req.params.id
        const theVal = [parseInt(addressId, 10)]
        const queryString = 'SELECT * FROM addresses WHERE id = $1'
        
        try {
            var result = await db.query(queryString, theVal)

            if(result) {
                res.status(200).send(result.rows);
            } else {
                res.status(400).send();
            }
        } catch(e) {
            res.status(400).send({message: e.message});
        }
    }) // end get by id

    // get by user id
    router.get('/user/:id', isAuthenticated, async function(req, res) {
        const userId = req.params.id
        const theVal = [parseInt(userId, 10)]

        const queryString = `SELECT *
                               FROM addresses
                               JOIN users_addresses 
                                 ON addresses.id = users_addresses.address_id
                              WHERE users_addresses.user_id = $1`
        
        try {
            var result = await db.query(queryString, theVal)

            if(result) {
                res.status(200).send(result.rows);
            } else {
                res.status(400).send();
            }
        } catch(e) {
            res.status(400).send({message: e.message});
        }
    }) // end get by user id

} // end module.exports

