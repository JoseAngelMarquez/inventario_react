const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/paginado', usuarioController.obtenerPaginados);
router.post('/login', usuarioController.login);
router.post('/crear', usuarioController.crearUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.delete('/:id', usuarioController.eliminarUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
module.exports = router;
