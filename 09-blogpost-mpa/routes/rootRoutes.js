const express = require("express");
const router = express.Router();
const rootControllers = require("../controllers/rootControllers");

/* GET home page. */
router.get("/", rootControllers.getRoot);

// GET about page
router.get("/about", rootControllers.getAbout);

// GET contact page
router.get("/contact", rootControllers.getContact);

module.exports = router;
