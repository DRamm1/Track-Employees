/* This is a way to hide your database password and username. */
const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../.env')
});

/* This is importing the mysql2 package. */
const mysql = require('mysql2');


/* This is creating a connection to the database. */
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    },

    console.log("Connected to database")
);

/* Exporting the database connection to be used in other files. */
module.exports = db;