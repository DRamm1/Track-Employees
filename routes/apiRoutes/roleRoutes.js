/* This is importing the express module, creating a router, and importing the database connection. */
const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

/* This is a get request to the roles table. */
router.get("/roles", (req, res) => {
    db.query("SELECT * FROM role", (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(results.rows);
        }
    })
})


/* This is exporting the router to the server.js file. */
module.exports = router;