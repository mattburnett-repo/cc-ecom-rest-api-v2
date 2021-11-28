process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');

chai.use(chaiHttp);

describe('API Product Routes', function() {
    describe('GET /api/v1/product', function() {
        it('should return multiple products', function(done) {
            chai.request(server)
            .get('/api/v1/product')
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json; // jshint ignore:line
              res.body.should.be.a('array');
              // res.body.length.should.equal(3);
  
              res.body[0].should.have.property('name');
              res.body[0].name.should.equal('product_name_01');
              res.body[0].should.have.property('description');
              res.body[0].description.should.equal('product_desc_01');
              res.body[0].should.have.property('price');
              res.body[0].price.should.equal('1.00');

              res.body[1].should.have.property('name');
              res.body[1].name.should.equal('product_name_02');
              res.body[1].should.have.property('description');
              res.body[1].description.should.equal('product_desc_02');
              res.body[1].should.have.property('price');
              res.body[1].price.should.equal('2.00');

              res.body[2].should.have.property('name');
              res.body[2].name.should.equal('product_name_03');
              res.body[2].should.have.property('description');
              res.body[2].description.should.equal('product_desc_03');
              res.body[2].should.have.property('price');
              res.body[2].price.should.equal('3.00');

              done();
              });
        });
    }); // end inner describe
    describe('GET /api/v1/product/:id', function() {
        it('should return a single product', function(done) {
            chai.request(server)
            .get('/api/v1/product/1')
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json; // jshint ignore:line
              res.body.should.be.a('array');

              res.body[0].should.have.property('name');
              res.body[0].name.should.equal('product_name_01');
              res.body[0].should.have.property('description');
              res.body[0].description.should.equal('product_desc_01');
              res.body[0].should.have.property('price');
              res.body[0].price.should.equal('1.00');
  
              done();
            });
        });
      }); // end inner describe
      
    describe('GET /api/v1/product/:id', function() {
        it('should handle request for non-existing product', function(done) {
            chai.request(server)
            .get('/api/v1/product/100')
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json; // jshint ignore:line
              res.body.should.be.a('array');

              res.body[0].should.have.property('message');
              res.body[0].message.should.equal('product id 100 not found');

              done();
            });
        });
      }); // end inner describe
    describe('POST /api/v1/product', function(){
        it('should add a product', function(done) {
            chai.request(server)
            .post('/api/v1/product')
            .send({
                name: 'product_name_04',
                description : 'product_desc_04',
                price: '4.00'
            })
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');

                res.body[0].should.have.property('name');
                res.body[0].name.should.equal('product_name_04');
                res.body[0].should.have.property('description');
                res.body[0].description.should.equal('product_desc_04');
                res.body[0].should.have.property('price');
                res.body[0].price.should.equal('4.00');

                done();
            });
          });
    }); // end inner describe

    describe('PUT /api/v1/product/:id', function(){
        it('should update a product', function(done) {
            chai.request(server)
            .put('/api/v1/product/4')
            .send({
                name: 'product_name_0444',
                description : 'product_desc_0444',
                price: 4.44
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');

                res.body[0].should.have.property('name');
                res.body[0].name.should.equal('product_name_0444');
                res.body[0].should.have.property('description');
                res.body[0].description.should.equal('product_desc_0444');
                res.body[0].should.have.property('price');
                res.body[0].price.should.equal('4.44');

                done();
            });        
        });
    }); // end inner describe

    describe('DELETE /api/v1/product/:id', function(){
        it('should delete a product', function(done) {
            chai.request(server)
            .delete('/api/v1/product/4')
            .send()
            .end(function(err, res) {
                res.should.have.status(204);
                done();
            });         
        });
    }); // end inner describe

    describe('DELETE /api/v1/product/:id', function(){
        it('should handle delete request for a non-existent product', function(done) {
            chai.request(server)
            .delete('/api/v1/product/4')
            .send()
            .end(function(err, res) {
                res.should.have.status(204);
                done();
            });     
        });
    }); // end inner describe

    describe('PUT /api/v1/product/:id', function() {
        it('should handle update for non-existing product', function(done) {
            chai.request(server)
            .put('/api/v1/product/4')
            .end(function(err, res) {
              res.should.have.status(204);
              done();
            });
        });
      }); // end inner describe
});