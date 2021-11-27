process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');

chai.use(chaiHttp);

describe('API User Routes', function() {
    describe('GET /api/v1/user', function() {
        it('should return multiple users', function(done) {
          chai.request(server)
          .get('/api/v1/user')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('array');
            res.body.length.should.equal(3);

            res.body[0].should.have.property('user_name');
            res.body[0].user_name.should.equal('username_01');
            res.body[0].should.have.property('password');
            res.body[0].password.should.equal('password_01');
            res.body[1].should.have.property('user_name');
            res.body[1].user_name.should.equal('username_02');
            res.body[1].should.have.property('password');
            res.body[1].password.should.equal('password_02');
            res.body[2].should.have.property('user_name');
            res.body[2].user_name.should.equal('username_03');
            res.body[2].should.have.property('password');
            res.body[2].password.should.equal('password_03');

            done();
            });
        });
    }); // end inner describe
    describe('GET /api/v1/user/:id', function() {
        it('should return a single user', function(done) {
          chai.request(server)
          .get('/api/v1/user/1')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json; // jshint ignore:line
            res.body.should.be.a('array');
            res.body[0].should.have.property('user_name');
            res.body[0].user_name.should.equal('username_01');
            res.body[0].should.have.property('password');
            res.body[0].password.should.equal('password_01');

            done();
          });
        });
      }); // end inner describe
      describe('GET /api/v1/user/:id', function() {
        it('should handle request for non-existing user', function(done) {
          chai.request(server)
          .get('/api/v1/user/4')
          .end(function(err, res) {
            res.should.have.status(204);
            done();
          });
        });
      }); // end inner describe
    describe('POST /api/v1/user', function(){
        it('should add a user', function(done) {
            chai.request(server)
            .post('/api/v1/user')
            .send({
                id: 4,
                user_name: 'username_04',
                password : 'password_04'
            })
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');
                res.body[0].should.have.property('user_name');
                res.body[0].user_name.should.equal('username_04');
                res.body[0].should.have.property('password');
                res.body[0].password.should.equal('password_04');
                done();
            });
          });
    }); // end inner describe

    describe('PUT /api/v1/user/:id', function(){
        it('should update a user', function(done) {
            chai.request(server)
            .put('/api/v1/user/4')
            .send({
                id: 4,
                user_name: 'username_044',
                password : 'password_044'
            })
            .end(function(err, res) {
                res.should.have.status(205);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a('array');
                res.body[0].should.have.property('user_name');
                res.body[0].user_name.should.equal('username_044');
                res.body[0].should.have.property('password');
                res.body[0].password.should.equal('password_044');
                done();
            });        
        }); 
    }); // end inner describe

    describe('DELETE /api/v1/user/:id', function(){
        it('should delete a user', function(done) {
            chai.request(server)
            .delete('/api/v1/user/4')
            .send()
            .end(function(err, res) {
                res.should.have.status(204);
                done();
            });      
        });
    }); // end inner describe

    describe('DELETE /api/v1/user/:id', function(){
        it('should handle delete request for a non-existent user', function(done) {
            chai.request(server)
            .delete('/api/v1/user/4')
            .send()
            .end(function(err, res) {
                res.should.have.status(204);
                done();
            });      
        });
    }); // end inner describe

    describe('PUT /api/v1/user/:id', function() {
        it('should handle update for non-existing user', function(done) {
          chai.request(server)
          .put('/api/v1/user/4')
          .end(function(err, res) {
            res.should.have.status(204);
            done();
          });
        });
      }); // end inner describe
});