// git push heroku main

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require('express');
var app = express();

var PORT = process.env.PORT;

const loaders = require('./loaders');

async function startServer() {
    // Init application loaders
    loaders(app);
  
    // Start server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    })
  }
  
  startServer();