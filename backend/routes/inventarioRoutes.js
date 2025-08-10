const express = require("express");
const router = express.Router();
const { obtenerTotalesMateriales } = require("../controllers/inventarioController");

router.get("/materiales", obtenerTotalesMateriales);

module.exports = router;
