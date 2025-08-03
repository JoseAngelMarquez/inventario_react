const express = require('express');
const router = express.Router();
const conexion = require('../config/db');

// GET todos los usuarios
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM usuarios';
  conexion.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

// POST login (ruta: /api/usuarios/login)
router.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos de usuario o contraseña' });
  }

  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ? LIMIT 1';
  conexion.query(sql, [usuario, contrasena], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = results[0];
    delete user.contrasena; // No enviar contraseña en respuesta
    res.json(user);
  });
});

module.exports = router;
