
// https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

// some of the cart management routing is now handled by Redux (ie currentCart/savedCart)

const { request, persistedRequest, expect } = require('./testConfig')

describe('API Register Routes', () => {
    var userId

    it('should accept an unauthorized request', async () => {
        const response = await request.get("/api/v1/register")
        
        expect(response.status).to.eql(200)
    })
    it('should log in with a valid test account', async () => {
        const response = await persistedRequest.post('/login').send({ username: 'asdf', password: 'asdf' })
        expect(response.status).to.eql(302)
    })
    // **************************************************************************
    // *** following tests use valid persistedRequest session from test above ***
    // **************************************************************************

    // FIXME: local / API server registrations redirect to url's on the API
    //          they don't return response codes and you can't really
    //              get id's, etc from them. So there is left-over trash
    //                  data that breaks later test runs, if you don't delete
    //                  test records...
    //          the remote endpoints are basically the same thing, so we'll
    //              just use those

    // it('should register from the API server', async () => {
    //     const response = await persistedRequest.post('/api/v1/register')
    //                                 .send({
    //                                     username: 'REGISTER USER 01',
    //                                     password : 'REGISTER PASSWORD 01',
    //                                     password2: 'REGISTER PASSWORD 01',
    //                                     email: 'register_1@register.com'
    //                                 })
      
    //     // expect(response.status).to.eql(201)  

    //     // const attributes = response.body
    //     // expect(attributes).to.be.a('array')
    //     // expect(attributes[0]).to.include.keys('id', 'user_name', 'password', 'email')
    // })
    // // FIXME: delete user to keep tests accurate

    // it('should reject request for already-existing user registration from the API server', async () => {
    //     const response = await persistedRequest.post('/api/v1/register')
    //                                 .send({
    //                                     username: 'REGISTER USER 01',
    //                                     password : 'REGISTER PASSWORD 01',
    //                                     password2: 'REGISTER PASSWORD 01',
    //                                     email: 'register_1@register.com'
    //                                 })
    // })
    // // FIXME: delete user to keep tests accurate

    it('should register from a remote (ie React UI) server', async () => {
        const response = await persistedRequest.post('/api/v1/register/remote')
                                    .send({
                                        username: 'REGISTER USER 02',
                                        password : 'REGISTER PASSWORD 02',
                                        password2: 'REGISTER PASSWORD 02',
                                        email: 'register_2@register.com'
                                    })  
                                    
        expect(response.status).to.eql(200)  

        const attributes = response.body
        expect(attributes).to.be.a('array')
        expect(attributes[0]).to.include.keys('id', 'user_name', 'password', 'email')

        userId = attributes[0].id
        expect(attributes[0].user_name).to.eql('REGISTER USER 02')
        // password is hashed
        expect(attributes[0].email).to.eql('register_2@register.com')
    })
    it('should reject request for already-existing user registration from a remote (ie React UI) server', async () => {
        const response = await persistedRequest.post('/api/v1/register/remote')
                                    .send({
                                        username: 'REGISTER USER 02',
                                        password : 'REGISTER PASSWORD 02',
                                        password2: 'REGISTER PASSWORD 02',
                                        email: 'register_2@register.com'
                                    })
                                    
        expect(response.status).to.eql(400) 
    })

    it('deletes test user to keep tests accurate', async () => {
        const response = await persistedRequest.delete('/api/v1/user').send({user_id: userId})
          
        expect(response.status).to.eql(200) 
    })
})