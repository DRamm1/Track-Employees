/* This is importing the express module and creating a router object. */
const express = require('express');
const router = express.Router();

/* This is importing the routes from the other files. */
router.use(require('./departmentRoutes'));
router.use(require('./employeeRoutes'));
router.use(require('./roleRoutes'));

/* This is exporting the router object so that it can be used in other files. */
module.exports = router;