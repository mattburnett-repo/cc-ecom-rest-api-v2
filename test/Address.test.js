
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

// note to self: to.eql, etc. comes from Chai (https://www.chaijs.com/api/bdd/)

const { request, persistedRequest, expect } = require('./testConfig')

describe('API Address Routes', () => {
    it('should reject an unauthorized request', async () => {
        const response = await request.get("/api/v1/address")
        
        expect(response.status).to.eql(401)
      })
    it('should log in with a valid test account', async () => {
        const response = await persistedRequest.post('/login').send({ username: 'asdf', password: 'asdf' })
        expect(response.status).to.eql(302)
    })

    it('creates a new address', async () => {
        const response = await persistedRequest.post('/api/v1/address')
                                .send({
                                    firstName: 'test_firstName', 
                                    lastName: 'test_lastName', 
                                    address1: 'test_address_1', 
                                    address2: 'test_address_2', 
                                    city: 'test_city', 
                                    stateProvince: 'test_stateProvince', 
                                    postalCode: 'test_postalCode', 
                                    country: 'test_country'
                                })

        expect(response.status).to.eql(200)

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.be.greaterThan(0)
        expect(attributes[0]).to.include.keys('first_name', 'last_name', 'address_1', 'address_2', 'city', 'state_province', 'postal_code', 'country')

        expect(attributes[0].first_name).to.eql('test_firstName')
        expect(attributes[0].last_name).to.eql('test_lastName')
        expect(attributes[0].address_1).to.eql('test_address_1')
        expect(attributes[0].address_2).to.eql('test_address_2')
        expect(attributes[0].city).to.eql('test_city')
        expect(attributes[0].state_province).to.eql('test_stateProvince')
        expect(attributes[0].postal_code).to.eql('test_postalCode')
        expect(attributes[0].country).to.eql('test_country')
    })

    it('gets all addresses', async () => {
    const response = await persistedRequest.get("/api/v1/address")
      
      expect(response.status).to.eql(200)

      const attributes = response.body
      expect(attributes).to.be.a('array')
      expect(attributes.length).to.be.greaterThan(0) 
      expect(attributes[0]).to.include.keys('first_name', 'last_name', 'address_1', 'address_2', 'city', 'state_province', 'postal_code', 'country')

      expect(attributes[0].first_name).to.eql('first name')
      expect(attributes[0].last_name).to.eql('last name')
      expect(attributes[0].address_1).to.eql('address 1')
      expect(attributes[0].address_2).to.eql('address 2')
      expect(attributes[0].city).to.eql('city')
      expect(attributes[0].state_province).to.eql('state province')
      expect(attributes[0].postal_code).to.eql('postal code')
      expect(attributes[0].country).to.eql('country')

      // carry on for additiional addresses if you like
    })

    it('gets an address by address id', async () => {
        const response = await persistedRequest.get("/api/v1/address/1")

        expect(response.status).to.eql(200)

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.eql(1)

        expect(attributes[0]).to.include.keys('first_name', 'last_name', 'address_1', 'address_2', 'city', 'state_province', 'postal_code', 'country')

        expect(attributes[0].first_name).to.eql('first name')
        expect(attributes[0].last_name).to.eql('last name')
        expect(attributes[0].address_1).to.eql('address 1')
        expect(attributes[0].address_2).to.eql('address 2')
        expect(attributes[0].city).to.eql('city')
        expect(attributes[0].state_province).to.eql('state province')
        expect(attributes[0].postal_code).to.eql('postal code')
        expect(attributes[0].country).to.eql('country')
    })

    it('gets addresses by user id', async () => {
        const response = await persistedRequest.get("/api/v1/address/user/1")
        expect(response.status).to.eql(200)

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.be.greaterThan(0)

        expect(attributes[0]).to.include.keys('first_name', 'last_name', 'address_1', 'address_2', 'city', 'state_province', 'postal_code', 'country')

        expect(attributes[0].first_name).to.eql('first name')
        expect(attributes[0].last_name).to.eql('last name')
        expect(attributes[0].address_1).to.eql('address 1')
        expect(attributes[0].address_2).to.eql('address 2')
        expect(attributes[0].city).to.eql('city')
        expect(attributes[0].state_province).to.eql('state province')
        expect(attributes[0].postal_code).to.eql('postal code')
        expect(attributes[0].country).to.eql('country')
    })
}) // end outer describe