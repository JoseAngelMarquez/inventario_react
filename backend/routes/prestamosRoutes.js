const express = require('express');
const router = express.Router();
const controller = require('../controller/prestamosController');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/prestamos', controller.crear);
router.put('/api/prestamos/:id', controller.actualizar);
router.delete('/api/prestamos/:id', controller.eliminar);

module.exports = router;
