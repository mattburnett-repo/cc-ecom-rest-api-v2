
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

const { request, expect } = require('./testConfig')

describe('API Auth Routes', () => {
  describe('Remote (ie React UI app) auth routes', () => {
    let authToken = ''

    it("requests the login page", async () => {
      const response = await request.get("/");

      expect(response.status).to.eql(200);
    });
    it('should reject log in from a remote (ie the React UI server) using a non-existing account', async () => {
      const response = await request.post("/api/v1/auth/local").send({ username: '34563456', password: 'as34563465df' });

      expect(response.status).to.eql(401)
    })
    it('should log in from a remote (ie the React UI server) using a test account', async () =>  {
      const response = await request.post('/api/v1/auth/local').send({ username: 'asdf', password: 'asdf' })

      expect (response.status).to.eql(200)

      const attributes = response.body
      //   res.should.be.json
      expect(attributes).to.include.keys("user", "token")
      expect(attributes.user).to.include.keys("id", "user_name", "password", "email")

      expect(attributes.user.user_name).to.eql('asdf')
      // password is hashed
      expect(attributes.user.password.length).to.be.greaterThan(0)
      expect(attributes.user.password).to.be.a('string')
      expect(attributes.user.email).to.eql('asdf@asdf.com')

      authToken = response.body.token
    }); 
    it('should log the user out', async () => {
      const response = await request.post('/api/v1/auth/logout').send()
      expect (response.status).to.eql(200)
    })


    // TODO: it should check oauth, others (local)


  }) // end remote auth routes describe
}) // end outer describe