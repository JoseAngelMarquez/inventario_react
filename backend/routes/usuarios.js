const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/login', usuarioController.login);
router.post('/crear', usuarioController.crearUsuario);
router.get('/me', usuarioController.obtenerUsuarioActual);

module.exports = router;
