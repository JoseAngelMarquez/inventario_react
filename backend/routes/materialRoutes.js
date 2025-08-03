const express = require("express");
const router = express.Router();
const MaterialController = require("../controllers/MaterialController");

router.get("/", MaterialController.obtenerMateriales);
router.post("/", MaterialController.crearMaterial);
router.put("/:id", MaterialController.actualizarMaterial);
router.delete("/:id", MaterialController.eliminarMaterial);

module.exports = router;
