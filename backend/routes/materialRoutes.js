const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');



router.get("/filtro", materialController.filtrarMaterialPorNombre);
router.get('/', materialController.obtenerMateriales);
router.get('/:id', materialController.obtenerMaterialPorId);
router.post('/', materialController.crearMaterial);
router.put('/:id', materialController.actualizarMaterial);
router.delete('/:id', materialController.eliminarMaterial);

module.exports = router;
