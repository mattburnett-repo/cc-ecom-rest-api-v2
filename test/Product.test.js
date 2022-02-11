
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

// note to self: to.eql, etc. comes from Chai (https://www.chaijs.com/api/bdd/)

const { request, persistedRequest, expect } = require('./testConfig')

describe('API Product Routes', () => {
    var productId 

    it('should reject an unauthorized request', async () => {
        const response = await request.get("/api/v1/product")
        expect(response.status).to.eql(401)
    })
    it('should log in with a valid test account', async () => {
        const response = await persistedRequest.post('/login').send({ username: 'asdf', password: 'asdf' })
        expect(response.status).to.eql(302)
    })
    // **************************************************************************
    // *** following tests use valid persistedRequest session from test above ***
    // **************************************************************************

    it('should return all products', async () => {
        const response = await persistedRequest.get('/api/v1/product')

        expect(response.status).to.eql(200)

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes.length).to.eql(32) 

        expect(attributes[0]).to.include.keys('id', 'category_id', 'name', 'description', 'image_url', 'price')
        expect(attributes[0].id).to.eql(1)
        expect(attributes[0].category_id).to.eql(1)
        expect(attributes[0].name).to.eql('Cat and Dog Accessories')
        expect(attributes[0].description).to.include('In a world where cats and dogs are loved as family members,')
        expect(attributes[0].image_url).to.eql('https://media.istockphoto.com/photos/accessories-for-cat-and-dog-on-blue-background-pet-care-and-training-picture-id1248454290')
        expect(attributes[0].price).to.eql('1.00')
    });

    it('should return all products for a given category', async () => {
      const response = await persistedRequest.get('/api/v1/product/category/1')

      expect(response.status).to.eql(200)

      const attributes = response.body
      expect(attributes).to.be.a('array')
      expect(attributes.length).to.eql(8) 

      expect(attributes[0]).to.include.keys('id', 'category_id', 'name', 'description', 'image_url', 'price')
      expect(attributes[0].id).to.eql(1)
      expect(attributes[0].category_id).to.eql(1)
      expect(attributes[0].name).to.eql('Cat and Dog Accessories')
      expect(attributes[0].description).to.include('In a world where cats and dogs are loved as family members,')
      expect(attributes[0].image_url).to.eql('https://media.istockphoto.com/photos/accessories-for-cat-and-dog-on-blue-background-pet-care-and-training-picture-id1248454290')
      expect(attributes[0].price).to.eql('1.00')
  });   
  
  it('should search all products with search term', async () => {
    const response = await persistedRequest.post('/api/v1/product/search')
                              .send({
                                searchTerm: 'cat'
                              })

    expect(response.status).to.eql(200)

    const attributes = response.body
    expect(attributes).to.be.a('array')
    expect(attributes.length).to.eql(4) 

    expect(attributes[0]).to.include.keys('id', 'category_id', 'name', 'description', 'image_url', 'price')
    expect(attributes[0].id).to.eql(1)
    expect(attributes[0].category_id).to.eql(1)
    expect(attributes[0].name).to.eql('Cat and Dog Accessories')
    expect(attributes[0].description).to.include('In a world where cats and dogs are loved as family members,')
    expect(attributes[0].image_url).to.eql('https://media.istockphoto.com/photos/accessories-for-cat-and-dog-on-blue-background-pet-care-and-training-picture-id1248454290')
    expect(attributes[0].price).to.eql('1.00')
});  

  it('should return a single product', async () => {
      const response = await persistedRequest.get('/api/v1/product/1')

      expect(response.status).to.eql(200)

      const attributes = response.body
      expect(attributes).to.be.an('object')

      expect(attributes).to.include.keys('id', 'category_id', 'name', 'description', 'image_url', 'price')
      expect(attributes.id).to.eql(1)
      expect(attributes.category_id).to.eql(1)
      expect(attributes.name).to.eql('Cat and Dog Accessories')
      expect(attributes.description).to.include('In a world where cats and dogs are loved as family members,')
      expect(attributes.image_url).to.eql('https://media.istockphoto.com/photos/accessories-for-cat-and-dog-on-blue-background-pet-care-and-training-picture-id1248454290')
      expect(attributes.price).to.eql('1.00')
  });

  it('should handle request for non-existing product', async () => {
      var productId = 1000
      const response = await persistedRequest.get(`/api/v1/product/${productId}`)

      expect(response.status).to.eql(400)

      const attributes = response.body
      expect(attributes).to.be.an('array')
      expect(attributes[0]).to.include.keys('message')
      expect(attributes[0].message).to.include(`product id ${productId} not found`)
  });

  it('should add a product', async () => {
      const response = await persistedRequest.post('/api/v1/product')
                                .send({
                                    category_id: 1,
                                    name: 'TEST PRODUCT',
                                    description : 'TEST PRODUCT',
                                    price: '100.00',
                                    image_url: 'http://www.test.com/test.jpg'
                                })

      expect(response.status).to.eql(201)

      const attributes = response.body
      expect(attributes).to.be.an('array')
      
      expect(attributes[0]).to.include.keys('id', 'category_id', 'name', 'description', 'image_url', 'price')
      // pk / auto-increment messes up id, so it's not practical to test it...
      productId = attributes[0].id
      expect(attributes[0].category_id).to.eql(1)
      expect(attributes[0].name).to.eql('TEST PRODUCT')
      expect(attributes[0].description).to.include('TEST PRODUCT')
      expect(attributes[0].image_url).to.eql('http://www.test.com/test.jpg')
      expect(attributes[0].price).to.eql('100.00') 
  });

  it('should update a product', async () => {
    const response = await persistedRequest.put('/api/v1/product')
                            .send({
                                id: productId,
                                category_id: 2,
                                name: 'UPDATED PRODUCT',
                                description : 'UPDATED PRODUCT',
                                image_url: 'http://www.update.com/update.jpg',
                                price: 200.00
                            })

    expect(response.status).to.eql(200)

    const attributes = response.body
    expect(attributes).to.be.an('array')
    
    expect(attributes[0]).to.include.keys('id', 'category_id', 'name', 'description', 'image_url', 'price')

    expect(attributes[0].category_id).to.eql(2)
    expect(attributes[0].name).to.eql('UPDATED PRODUCT')
    expect(attributes[0].description).to.include('UPDATED PRODUCT')
    expect(attributes[0].image_url).to.eql('http://www.update.com/update.jpg')
    expect(attributes[0].price).to.eql('200.00')        
  });

  it('should handle update for non-existing product', async () => {
      const response = await persistedRequest.put('/api/v1/product')
                              .send({
                                id: 100000,
                                category_id: 2,
                                name: 'UPDATED PRODUCT',
                                description : 'UPDATED PRODUCT',
                                image_url: 'http://www.update.com/update.jpg',
                                price: 200.00
                            })
      expect(response.status).to.eql(204)
    
      // const attributes = response.body
      // expect(attributes).to.be.an('object')
      
      // expect(attributes).to.include.keys('message')
      // // expect(attributes.message).to.eql`product_id: 100000 not found.`

  });

  it('should delete a product', async () => {
    const response = await persistedRequest.delete('/api/v1/product')
                              .send({
                                product_id: productId
                              })
    expect(response.status).to.eql(204)        
  });

  it('should handle delete request for a non-existent product', async () => {
    const response = await persistedRequest.delete('/api/v1/product')
                              .send({
                                product_id: productId
                              })
    expect(response.status).to.eql(204)     
  });
});