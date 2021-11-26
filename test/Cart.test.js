process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');

chai.use(chaiHttp);

describe('API Cart Routes', function() {
    describe('POST /api/v1/cart', function() {
        it('should create a cart for a user', function(done) {
        
        });
    }); // end inner describe
    describe('POST /api/v1/cart', function() {
        it('should add an item to a user cart', function(done) {
        
        });
    }); // end inner describe
    describe('PUT /api/v1/cart', function() {
        it('should update an item in a user cart', function(done) {
        
        });
    }); // end inner describe
    describe('DELETE /api/v1/cart', function() {
        it('should delete an item from a user cart', function(done) {
        
        });
    }); // end inner describe
    describe('GET /api/v1/cart', function() {
        it('should show a users cart', function(done) {
        
        });
    }); // end inner describe
    describe('DELETE /api/v1/cart', function() {
        it('should delete a users cart', function(done) {
        
        });
    }); // end inner describe
}); // end outer describe