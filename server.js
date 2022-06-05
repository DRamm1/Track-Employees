/* This is importing the dotenv, express, apiRoutes, and db modules. */
require('dotenv').config();
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const db = require('./db/connection');

/* This is importing the Company class from the company.js file. */
const Company = require('./lib/company');

/* This is setting the port that the server will listen on. The first part is checking to see if
the PORT environment variable is set. If it is, it will use that port. If it is not, it will use
port
5000. The second part is creating an express app. */
const PORT = process.env.PORT || 5000;
const app = express();

/* This is telling the server to parse the body of the request and make it available in the request
object. */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* This is telling the server to use the apiRoutes file for any requests that start with /api. */
app.use('/api', apiRoutes);

/* This is a middleware function that is called when the server receives a request that does not match
any of the routes. It is returning a 404 status code and ending the response. */
app.use((req, res) => {
    res.status(404).end();
})


/* This is connecting to the database and then starting the server. */
db.connect(err => {
    if (err) throw err;
    console.log('Connected to DB.');
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);

      const company = new Company();
      company.seedDatabase();
      company.menu();
    });
  });
  