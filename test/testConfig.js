
// note to self: to.eql, etc. comes from Chai (https://www.chaijs.com/api/bdd/)

// test.todo === pending
//    https://mochajs.org/#pending-tests
//
//    it('should take long enough for me to go make a sandwich', function() {
//      // ...
//    });


const app = require('../app')
const request = require("supertest")(app);

// Do this to enable auth persistence
//      https://stackoverflow.com/questions/14001183/how-to-authenticate-supertest-requests-with-passport
const persistedRequest = require("supertest").agent(app);

const expect = require("chai").expect;

module.exports = {
  request,
  persistedRequest,
  expect,
};