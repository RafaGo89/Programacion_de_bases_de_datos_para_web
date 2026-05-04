const express = require("express");
const router = express.Router();
const equiposControllers = require("../controllers/equiposControllers");
const authControllers = require("../controllers/authControllers");
const { equipo } = require("./rootRoutes");

// GET individual equipo page
router.get("/id/:id", equiposControllers.getEquipo);

// GET para subir un nuevo equipo
router.get(
    "/nuevo",
    authControllers.protect,
    equiposControllers.getNuevoEquipo,
);

// POST cre(ar un nuevo documento en la base de datos
router.post("/store", authControllers.protect, equiposControllers.createEquipo);

module.exports = router;
