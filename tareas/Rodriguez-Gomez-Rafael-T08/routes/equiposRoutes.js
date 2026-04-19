const express = require("express");
const router = express.Router();
const equiposControllers = require("../controllers/equiposControllers");
const { equipo } = require("./rootRoutes");

// GET individual equipo page
router.get("/id/:id", equiposControllers.getEquipo);

// GET para subir un nuevo equipo
router.get("/nuevo", equiposControllers.getNuevoEquipo);

// POST cre(ar un nuevo documento en la base de datos
router.post("/store", equiposControllers.createEquipo);

module.exports = router;
