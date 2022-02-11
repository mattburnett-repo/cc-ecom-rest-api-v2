
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

// some of the cart management routing is now handled by Redux (ie currentCart/savedCart)

const { request, persistedRequest, expect } = require('./testConfig')

describe('API Product Category Routes', () => {
    it('should reject an unauthorized request', async () => {
        const response = await request.get("/api/v1/product-category")
        
        expect(response.status).to.eql(401)
    })
    it('should log in with a valid test account', async () => {
        const response = await persistedRequest.post('/login').send({ username: 'asdf', password: 'asdf' })
        expect(response.status).to.eql(302)
    })
    // **************************************************************************
    // *** following tests use valid persistedRequest session from test above ***
    // **************************************************************************

    it('should return product categories', async () =>  {
        const response = await persistedRequest.get("/api/v1/product-category")
        
        expect(response.status).to.eql(200)
  
        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.eql(4)
  
        expect(attributes[0]).to.include.keys("category_id", "description")
        expect(attributes[0].category_id).to.eql(4)
        expect(attributes[0].description).to.eql('Auto')
  
        // carry on for additiional categories if you like
    });
    it('should return product category by id', async () =>  {
        const response = await persistedRequest.get("/api/v1/product-category/1")
        
        expect(response.status).to.eql(200)

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.eql(1)

        expect(attributes[0]).to.include.keys("category_id", "description")
        expect(attributes[0].category_id).to.eql(1)
        expect(attributes[0].description).to.eql('Pet Accessories')
    });
})