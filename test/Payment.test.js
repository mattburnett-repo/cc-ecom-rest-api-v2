
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

// some of the cart management routing is now handled by Redux (ie currentCart/savedCart)

const { request, persistedRequest, expect } = require('./testConfig')

describe('API Payment Routes', () => {
    it('should reject an unauthorized request', async () => {
        const response = await request.get("/api/v1/payment")
        
        expect(response.status).to.eql(401)
    })
    it('should log in with a valid test account', async () => {
        const response = await persistedRequest.post('/login').send({ username: 'asdf', password: 'asdf' })
        expect(response.status).to.eql(302)
    })
    // **************************************************************************
    // *** following tests use valid persistedRequest session from test above ***
    // **************************************************************************

    it('should return all payments', async () =>  {
        const response = await persistedRequest.get("/api/v1/payment")
        
        expect(response.status).to.eql(200)
  
        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.be.greaterThan(0) 
  
        expect(attributes[0]).to.include.keys("id", "user_id", "stripe_id", 'created', 'payment_method', 'receipt_url', 'transaction_status', 'amount')
  
        // test data values in the 'get by id' test/s
    });

    it('should return payments by payment id', async () =>  {
        const response = await persistedRequest.get("/api/v1/payment/1")
        
        expect(response.status).to.eql(200)
  
        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.eql(1) 
  
        expect(attributes[0]).to.include.keys("id", "user_id", "stripe_id", 'created', 'payment_method', 'receipt_url', 'transaction_status', 'amount')
        expect(attributes[0].id).to.eql(1)
        expect(attributes[0].user_id).to.eql(4)
        expect(attributes[0].stripe_id).to.eql('ch_3KOmFCHtApZFXC0d0cj7hVUD')
        expect(attributes[0].created).to.eql(1643821426)
        expect(attributes[0].payment_method).to.eql('card_1KOmFBHtApZFXC0ddcy9K6Tf')
        expect(attributes[0].receipt_url).to.eql('https://pay.stripe.com/receipts/acct_1JbXRXHtApZFXC0d/ch_3KOmFCHtApZFXC0d0cj7hVUD/rcpt_L4w73GIyEs26QaVro5kODRmOZ56o4JA')
        expect(attributes[0].transaction_status).to.eql('succeeded')
        expect(attributes[0].amount).to.eql('18.00')  
    });

    it('should return payments by user id', async () =>  {
        const response = await persistedRequest.get("/api/v1/payment/user/4")
        
        expect(response.status).to.eql(200)
  
        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.be.greaterThan(0) 
  
        expect(attributes[0]).to.include.keys("id", "user_id", "stripe_id", 'created', 'payment_method', 'receipt_url', 'transaction_status', 'amount')
        expect(attributes[0].id).to.eql(1)
        expect(attributes[0].user_id).to.eql(4)
        expect(attributes[0].stripe_id).to.eql('ch_3KOmFCHtApZFXC0d0cj7hVUD')
        expect(attributes[0].created).to.eql(1643821426)
        expect(attributes[0].payment_method).to.eql('card_1KOmFBHtApZFXC0ddcy9K6Tf')
        expect(attributes[0].receipt_url).to.eql('https://pay.stripe.com/receipts/acct_1JbXRXHtApZFXC0d/ch_3KOmFCHtApZFXC0d0cj7hVUD/rcpt_L4w73GIyEs26QaVro5kODRmOZ56o4JA')
        expect(attributes[0].transaction_status).to.eql('succeeded')
        expect(attributes[0].amount).to.eql('18.00')  
    });

    // stripe testing depends on a secret key
})