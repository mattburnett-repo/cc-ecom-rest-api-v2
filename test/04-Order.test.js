process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');

chai.use(chaiHttp);

describe('API Order Routes', function() {
    describe('POST /api/v1/order', function(){
        it('should create an order', function(done) {
            chai.request(server)
            .post('/api/v1/order')
            .send({
                user_id: 1,
                cart_id: 1
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');
                res.body.length.should.equal(1);

                res.body[0].should.have.property('user_id');
                res.body[0].user_id.should.equal(1);
                res.body[0].should.have.property('cart_id');
                res.body[0].cart_id.should.equal(1);
                res.body[0].should.have.property('total_price');
                res.body[0].total_price.should.equal('4');

                done();
            });
        });
    }); // end inner describe
    describe('GET /api/v1/order', function() {
        it('should return all orders', function(done) {
          chai.request(server)
          .get('/api/v1/order')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('array');
            // res.body.length.should.equal(1); 

            res.body[0].should.have.property('user_id');
            res.body[0].user_id.should.equal(1);
            res.body[0].should.have.property('cart_id');
            res.body[0].cart_id.should.equal(1);
            res.body[0].should.have.property('total_price');
            res.body[0].total_price.should.equal('4');

            done();
            });
        });
    }); // end inner describe
    describe('GET /api/v1/order/:id', function() {
        it('should return a single order', function(done) {
          chai.request(server)
          .get('/api/v1/order/1')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('array');
            res.body.length.should.equal(1); 

            res.body[0].should.have.property('user_id');
            res.body[0].user_id.should.equal(1);
            res.body[0].should.have.property('cart_id');
            res.body[0].cart_id.should.equal(1);
            res.body[0].should.have.property('total_price');
            res.body[0].total_price.should.equal('4');

            done();
          });
        });
      }); // end inner describe

    describe('DELETE /api/v1/order/:id', function(){
        it('should delete a order', function(done) {
            chai.request(server)
            .delete('/api/v1/order/1')
            .send()
            .end(function(err, res) {
                res.should.have.status(204);

                done();
            });      
        });
    }); // end inner describe
}); // end out describe