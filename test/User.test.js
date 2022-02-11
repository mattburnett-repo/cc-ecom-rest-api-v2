
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

// note to self: to.eql, etc. comes from Chai (https://www.chaijs.com/api/bdd/)

const { request, persistedRequest, expect } = require('./testConfig')

describe('API User Routes', () => {
    var userId // use this for update / delete / usw

    it('should reject an unauthorized request', async () => {
      const response = await request.get("/api/v1/user")
      
      expect(response.status).to.eql(401)
    })
    it('should log in with a valid test account', async () => {
      const response = await persistedRequest.post('/login').send({ username: 'asdf', password: 'asdf' })
      expect(response.status).to.eql(302)
    })
    // **************************************************************************
    // *** following tests use valid persistedRequest session from test above ***
    // **************************************************************************

    it('should return multiple users', async () =>  {
      const response = await persistedRequest.get("/api/v1/user")
      
      expect(response.status).to.eql(200)

      const attributes = response.body
      expect(attributes).to.be.a('array')
      expect(attributes.length).to.be.greaterThan(0) 

      expect(attributes[0]).to.include.keys("user_name", "password")
      expect(attributes[0].user_name).to.eql('username_01')
      expect(attributes[0].password).to.eql('password_01')

      // carry on for additiional user accounts if you like
    });


    it('should return a single user', async () => {
      const response = await persistedRequest.get("/api/v1/user/1")

      expect(response.status).to.eql(200)

      const attributes = response.body
      expect(attributes).to.be.a('array')
      expect(attributes.length).to.eql(1)

      expect(attributes[0]).to.include.keys("user_name", "password")
      expect(attributes[0].user_name).to.eql('username_01')
      expect(attributes[0].password).to.eql('password_01')
    });
    it('should handle request for non-existing user', async () => {
      const response = await persistedRequest.get("/api/v1/user/1000")

      expect(response.status).to.eql(400)
    });

    it('should add a user', async () => {
      const response = await persistedRequest.post('/api/v1/user')
                                .send({
                                    username: 'username_04',
                                    password : 'password_04',
                                    email: '04@04.com'
                                })
                              
      expect(response.status).to.eql(201)  

      const attributes = response.body
      expect(attributes).to.be.a('array')
      expect(attributes[0]).to.include.keys('id', 'user_name', 'password', 'email')

      userId = attributes[0].id 
      expect(attributes[0].user_name).to.eql('username_04')
      expect(attributes[0].password).to.eql('password_04')
      expect(attributes[0].email).to.eql('04@04.com')
    });

    it('should update a user', async () => {
      const response = await persistedRequest.put('/api/v1/user')
                                .send({
                                    user_id: userId,
                                    username: 'username_044',
                                    password : 'password_044',
                                    email: '44@44.com'
                                })
      
      expect(response.status).to.eql(200)     

      const attributes = response.body
      expect(attributes).to.be.a('array')
      expect(attributes[0]).to.include.keys('id', 'user_name', 'password', 'email')

      expect(attributes[0].id).to.eql(userId)
      expect(attributes[0].user_name).to.eql('username_044')
      expect(attributes[0].password).to.eql('password_044')
      expect(attributes[0].email).to.eql('44@44.com')
    }); 
  
    it('should delete an existing user', async () => {
      const response = await persistedRequest.delete('/api/v1/user')
                              .send({user_id: userId})

      expect(response.status).to.eql(200)
    });

    // TODO: make sure there is a logout test, or logout cleanup, or something similar
}) // end outer describe