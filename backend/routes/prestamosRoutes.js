const express = require('express');
const router = express.Router();
const controller = require('../controllers/prestamosController');


router.get('/filtro',controller.filtrarPrestamos)
router.get('/filtroFecha',controller.filtrarPorFecha)
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
//router.delete('/:id', controller.eliminar);
router.put('/:id/finalizar', controller.finalizar);
router.get('/exportar/excel', controller.exportarExcel);
router.get('/reporte/completo', controller.reporteCompleto);


module.exports = router;
