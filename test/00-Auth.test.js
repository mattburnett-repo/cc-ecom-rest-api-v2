process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');

chai.use(chaiHttp);

describe('API Auth Routes', function() {
    describe('GET /api/v1/auth', function() {

    }); // end inner describe
}); // end outer describe