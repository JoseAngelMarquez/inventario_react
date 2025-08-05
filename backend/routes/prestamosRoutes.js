const express = require('express');
const router = express.Router();
const PrestamosController = require('../controllers/prestamosController');

router.post('/', PrestamosController.prestarMaterial);

module.exports = router;
