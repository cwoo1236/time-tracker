// get port # from config.env
require("dotenv").config();

// create express process
const mongoose = require('mongoose');
const express = require("express");
const routes = require('./routes/record');

const app = express();

// middleware
app.use(express.json());

// configure express access control
app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/activities', routes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
        console.log('Connected to db & listening on port', process.env.PORT);
    });
  })
  .catch((error => {
    console.log(error);
  }));
