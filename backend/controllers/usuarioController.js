const Usuario = require('../models/usuarioModel');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }

  const conn = await pool.getConnection();

  try {
    const resultados = await Usuario.buscarPorUsuario(conn, usuario);

    if (resultados.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioEncontrado = resultados[0];

    const match = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

    if (match) {
      return res.json({ mensaje: 'Login exitoso', usuario: usuarioEncontrado });
    } else {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  } finally {
    conn.release();
  }
};




// Nuevo método para crear usuarios, por ejemplo llamado por el admin
exports.crearUsuario = async (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena || !rol) {
    return res.status(400).json({ mensaje: 'Faltan datos para crear usuario' });
  }

  const rolesValidos = ['admin', 'prestamista'];
  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ mensaje: 'Rol inválido' });
  }

  const conn = await pool.getConnection();

  try {
    const existente = await Usuario.buscarPorUsuario(conn, usuario);
    if (existente.length > 0) {
      return res.status(409).json({ mensaje: 'El usuario ya existe' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    const idNuevo = await Usuario.crear(conn, usuario, hashedPassword, rol);

    return res.status(201).json({ mensaje: 'Usuario creado', id: idNuevo });
  } catch (error) {
    console.error('Error creando usuario:', error.message);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  } finally {
    conn.release();
  }
};

// En el controlador usuariosController.js
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const userId = req.userId; 
    const conn = await pool.getConnection();
    const usuario = await Usuario.obtenerPorId(conn, userId);
    conn.release();

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

