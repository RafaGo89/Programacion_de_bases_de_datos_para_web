const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers");
const authControllers = require("../controllers/authControllers");

/* GET users listing. */
// router.get('/', usersControllers.getUsers);

// GET para la página de un nuevo usuario
router.get("/new", usersControllers.getNewUser);

// POST para crear un nuevo usuario
router.post("/signup", authControllers.signup);

module.exports = router;
