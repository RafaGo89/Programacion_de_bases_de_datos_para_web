const express = require('express');
const router = express.Router();
const usersControllers = require("../controllers/usersControllers");

/* GET users listing. */
router.get('/', usersControllers.getUsers);

module.exports = router;
