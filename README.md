# E-Commerce REST API project
This is a collection of RESTful API calls modelled on basic e-commerce functionality.

The focus of this project is the creation of REST APIs, and not the creation of a functioning online store.

Click the 'Deployment' link to go to the app. From there you can register / login, and then see the API specification.
All API routes are protected by authentication.

Click the 'GitHub Project' link to see the kanban project cards.

Deployment: https://e-commerce-rest-api-v2.herokuapp.com/ \
GitHub Project (https://github.com/mattburnett-repo/cc-ecom-rest-api-v2/projects/1)

## Technologies used
* Express / NodeJS
* EJS templating
* PostgreSQL / PGadmin / Postbird
* Mocha / Chai TDD suite
* Postman API development tool
* bcrypt encryption library
* Passport JS authentication library
  * Local / Basic (username, password) authentication
  * Google OAuth authentication
* Swagger API documentation
* Heroku deployment platform

## Future development / To do
* Everything can always be better...
* Tests are wrecked after refactoring everything to load from index.js instead of app.js
* OAuth creates problem in production server Swagger UI 'Try It Out' functionality. 
  * Shows login screen html template, and not endpoint output. 
  * OAuth is still implemented, just not used for API doc access, so you can see output of different API endpoints in 'Try It Out' parts of Swagger UI
