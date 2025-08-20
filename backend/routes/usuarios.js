const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/login', usuarioController.login);
router.post('/crear', usuarioController.crearUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.delete('/:id', usuarioController.eliminarUsuario);
module.exports = router;
