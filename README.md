# E-Commerce REST API project
This is a collection of RESTful API calls modelled on basic e-commerce functionality.

Click the 'Deployment' link below to go to the app. From there you can register / login, and then see the API specification.
All API routes are protected by authentication.

Click the 'GitHub Project' link to see the kanban project cards.

Deployment: https://e-commerce-rest-api-v2.herokuapp.com/ \
GitHub Project (https://github.com/mattburnett-repo/cc-ecom-rest-api-v2/projects/1)

This API is used / consumed by another project, "ecommerce-ui", a React app available at the following link\
https://ecommerce-react-ui.herokuapp.com/

To install after downloading / cloning this repo, 
  * run
    * npm install
  * then 
    * npm run dev

---

## Testing
Tests are located in the src/test folder

Tests are written using SuperTest / Chai and are run using Mocha test runner.

---

## Technologies used
* Express / NodeJS
* EJS templating
* PostgreSQL / PGadmin / Postbird
* Mocha / Chai / SuperTest TDD suite
* Postman API development tool
* bcrypt encryption library
* Passport JS authentication library
  * Local / Basic (username, password) authentication
  * Google OAuth authentication
* Swagger API documentation
* E-Commerce UI (React app)
  * UI code: https://github.com/mattburnett-repo/cc-ecomm-ui
* Heroku deployment platform

---

## Future development / To do
* Everything can always be better...
* OAuth creates problem in production server Swagger UI 'Try It Out' functionality. 
  * Shows login screen html template, and not endpoint output. 
  * OAuth is still implemented, just not used for API doc access, so you can see output of different API endpoints in 'Try It Out' parts of Swagger UI
* OAuth redirect doesn't send response to calling UI app. Need to sort this out.
