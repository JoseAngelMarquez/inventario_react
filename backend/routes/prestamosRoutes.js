const express = require('express');
const router = express.Router();
const controller = require('../controllers/prestamosController');


router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
//router.delete('/:id', controller.eliminar);
router.put('/:id/finalizar', controller.finalizar);
router.get('/exportar/excel', controller.exportarExcel);


module.exports = router;
