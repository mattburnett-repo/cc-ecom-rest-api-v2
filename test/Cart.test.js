process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');

chai.use(chaiHttp);

// TODO: get tests assume pre-existing cart. THESE ARE TEST/DEV TESTS, NOT PRODUCTION
//      These tests expect freshly-created database (run the createDatabase.sql script in ../db)
//          AND need a dummy cart before running (insert into carts (user_id) values (1);)

describe('API Cart Routes', function() {
    describe('GET /api/v1/cart', function() {
        it('should get all carts', function(done) {
            chai.request(server)
            .get('/api/v1/cart')
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json; // jshint ignore:line
  
              done();
            });
        });
    });
    describe('GET /api/v1/user/cart/1', function() {
        it('should get a cart by id', function(done) {
            chai.request(server)
            .get('/api/v1/cart/1')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');
                res.body.length.should.equal(1);

              done();
            });
        });
    });
    describe('POST /api/v1/cart', function() {
        it('should add first item to an existing cart', function(done) {
            chai.request(server)
            .post('/api/v1/cart/1')
            .send({
                product_id: 1,
                product_quantity: 1,
                product_price: 1.00
            })
            .end(function(err, res) {
                res.should.have.status(205);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');

                res.body[0].should.have.property('cart_id');
                res.body[0].cart_id.should.equal(1);
                res.body[0].should.have.property('product_id');
                res.body[0].product_id.should.equal(1);
                res.body[0].should.have.property('product_quantity');
                res.body[0].product_quantity.should.equal(1);
                res.body[0].should.have.property('product_price');
                res.body[0].product_price.should.equal('$1.00');
                res.body[0].should.have.property('line_item_total_price');
                res.body[0].line_item_total_price.should.equal('$1.00');

                done();
            });   
        });
    }); // end inner describe
    describe('POST /api/v1/cart', function() {
        it('should add second item to an existing cart', function(done) {
            chai.request(server)
            .post('/api/v1/cart/1')
            .send({
                product_id: 2,
                product_quantity: 2,
                product_price: 2.00
            })
            .end(function(err, res) {
                res.should.have.status(205);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');

                res.body[0].should.have.property('cart_id');
                res.body[0].cart_id.should.equal(1);
                res.body[0].should.have.property('product_id');
                res.body[0].product_id.should.equal(2);
                res.body[0].should.have.property('product_quantity');
                res.body[0].product_quantity.should.equal(2);
                res.body[0].should.have.property('product_price');
                res.body[0].product_price.should.equal('$2.00');
                res.body[0].should.have.property('line_item_total_price');
                res.body[0].line_item_total_price.should.equal('$4.00');

                done();
            });   
        });
    }); // end inner describe
    describe('PUT /api/v1/cart/:cartID', function() {
        it('should update first item in user cart', function(done) {
            chai.request(server)
            .put('/api/v1/cart/1')
            .send({
                cart_item_id: 1,
                product_quantity: 2,
                product_price: 1
            })
            .end(function(err, res) {
                res.should.have.status(205);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');

                res.body[0].should.have.property('cart_id');
                res.body[0].cart_id.should.equal(1);
                res.body[0].should.have.property('product_id');
                res.body[0].product_id.should.equal(1);
                res.body[0].should.have.property('product_quantity');
                res.body[0].product_quantity.should.equal(2);
                res.body[0].should.have.property('product_price');
                res.body[0].product_price.should.equal('$1.00');
                res.body[0].should.have.property('line_item_total_price');
                res.body[0].line_item_total_price.should.equal('$2.00');

                done();
            });            
        });
    }); // end inner describe
    describe('DELETE /api/v1/cart/:cartID', function() {
        it('should delete an item from a user cart', function(done) {
            chai.request(server)
            .delete('/api/v1/cart/1')
            .send({
                cart_item_id: 1
            })
            .end(function(err, res) {
                res.should.have.status(204);
                done();
            });      
        });
    }); // end inner describe

    // NOTE: we don't delete carts. Carts become Orders, that's why carts table has order_date

}); // end outer describe