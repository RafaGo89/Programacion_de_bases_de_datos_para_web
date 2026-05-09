const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers");
const authControllers = require("../controllers/authControllers");

/* GET users listing. */
// router.get('/', usersControllers.getUsers);

// GET para la página de un nuevo usuario
router.get("/new", usersControllers.getNewUser);

// GET para la página de inicio de sesión
router.get("/login", usersControllers.getLogInUser);

// GET para terminar sesión
router.get("/logout", authControllers.signout);

// POST para crear un nuevo usuario
router.post("/signup", authControllers.signup);

// POST para iniciar sesión
router.post("/signin", authControllers.signin);

module.exports = router;
