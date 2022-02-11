
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

// some of the cart management routing is now handled by Redux (ie currentCart/savedCart)

const { request, persistedRequest, expect } = require('./testConfig')

describe('API Cart Routes', () => {
    it('should reject an unauthorized request', async () => {
        const response = await request.get("/api/v1/cart")
        
        expect(response.status).to.eql(401)
    })
    it('should log in with a valid test account', async () => {
        const response = await persistedRequest.post('/login').send({ username: 'asdf', password: 'asdf' })
        expect(response.status).to.eql(302)
    })
    // **************************************************************************
    // *** following tests use valid persistedRequest session from test above ***
    // **************************************************************************

    it('should get all carts', async () => {
        const response = await persistedRequest.get("/api/v1/cart")
      
        expect(response.status).to.eql(200)

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.be.greaterThan(0) 

        expect(attributes[0]).to.include.keys("cart")
        expect(attributes[0].cart).to.include.keys('cart_id', 'user_id', 'cart_items', 'cart_total_price')
        expect(attributes[0].cart.cart_items[0]).to.include.keys('product_id', 'product_name', 'product_price', 'product_quantity', 'product_total_price')
    });

    it('should get a cart by id', async() => {
        const response = await persistedRequest.get("/api/v1/cart/1")
      
        expect(response.status).to.eql(200)

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.eql(1) 

        expect(attributes[0]).to.include.keys("cart")
        expect(attributes[0].cart).to.include.keys('cart_id', 'user_id', 'cart_items', 'cart_total_price')
        expect(attributes[0].cart.cart_items[0]).to.include.keys('product_id', 'product_name', 'product_price', 'product_quantity', 'product_total_price')

        expect(attributes[0].cart.cart_id).to.eql(1)
        expect(attributes[0].cart.user_id).to.eql(1)

        expect(attributes[0].cart.cart_items.length).to.eql(4)
        expect(attributes[0].cart.cart_items[0].product_id).to.eql(1)
        expect(attributes[0].cart.cart_items[0].product_name).to.eql("Cat and Dog Accessories")
        expect(attributes[0].cart.cart_items[0].product_price).to.eql(1)
        expect(attributes[0].cart.cart_items[0].product_quantity).to.eql(1)
        expect(attributes[0].cart.cart_items[0].product_total_price).to.eql(1)

        // carry on for additiional cart items if you like
    });

    it('should add first item to an existing cart', async () => {
        const response = await persistedRequest.post("/api/v1/cart")
                                    .send({
                                        cart_id: 1,
                                        product_id: 5,
                                        product_quantity: 5,
                                        product_price: 5.00
                                    })
      
        expect(response.status).to.eql(200)
 
        const attributes = response.body 
        expect(attributes).to.be.an('array')
        expect(attributes.length).to.eql(1)   

        expect(attributes[0]).to.include.keys('cart_id', 'product_id', 'product_quantity', 'product_price', 'line_item_total_price')

        expect(attributes[0].cart_id).to.eql(1)        
        expect(attributes[0].product_id).to.eql(5)
        expect(attributes[0].product_price).to.equal("5.00") // not sure why this is string. it's a 'mpney' type in the db
        expect(attributes[0].product_quantity).to.eql(5) 
        expect(attributes[0].line_item_total_price).to.eql("25.00")
    });

    it('should update first item quantity', async () => {
        const response = await persistedRequest.put('/api/v1/cart')
                                .send({
                                    cart_id: 1,
                                    product_id: 5,
                                    product_quantity: 10,
                                    product_price: 5.00
                                })

        expect(response.status).to.eql(200)

        const attributes = response.body 
        expect(attributes).to.be.an('array')
        expect(attributes.length).to.eql(1)   

        expect(attributes[0]).to.include.keys('cart_id', 'product_id', 'product_quantity', 'product_price', 'line_item_total_price')

        expect(attributes[0].cart_id).to.eql(1)        
        expect(attributes[0].product_id).to.eql(5)
        expect(attributes[0].product_price).to.equal("5.00") // not sure why this is string. it's a 'mpney' type in the db
        expect(attributes[0].product_quantity).to.eql(10) 
        expect(attributes[0].line_item_total_price).to.eql("50.00")           
    });

    it('should delete an item from a user cart', async () => {
        const response = await persistedRequest.delete('/api/v1/cart')
                                    .send({
                                        cart_id: 1,
                                        product_id: 5
                                    })
        expect(response.status).to.eql(200)
        
        const attributes = response.body
        expect(attributes).to.include.keys("message")     
        expect(attributes.message).to.equal('product_id 5 deleted from cart_id 1')
    });

    // NOTE: we don't delete carts. Carts become Orders, that's why carts table has order_date

}); // end describe

