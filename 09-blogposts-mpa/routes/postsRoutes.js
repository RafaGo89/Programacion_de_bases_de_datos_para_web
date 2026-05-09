const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/postsControllers");
const authControllers = require("../controllers/authControllers");
const { post } = require("./rootRoutes");

/* GET individual post page */
router.get("/id/:id", postsControllers.getPost);

/* GET página para subir nuevo posteo */
router.get("/new", authControllers.protect, postsControllers.getNewPost);

/* POST crear un nuevo documento en la base de datos */
router.post("/store", authControllers.protect, postsControllers.createPost);

module.exports = router;
