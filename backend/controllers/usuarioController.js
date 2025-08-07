const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }

  try {
    const resultados = await Usuario.buscarPorUsuario(usuario);

    if (resultados.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioEncontrado = resultados[0];

    // Comparar la contraseña ingresada con la hasheada en la DB
    const match = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

    if (match) {
      return res.json({ mensaje: 'Login exitoso', usuario: usuarioEncontrado });
    } else {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
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

  try {
    // Verificar si usuario ya existe
    const existente = await Usuario.buscarPorUsuario(usuario);
    if (existente.length > 0) {
      return res.status(409).json({ mensaje: 'El usuario ya existe' });
    }

    // Hashear la contraseña antes de guardarla
    const saltRounds = 10; // Entre más alto, más seguro, pero más lento
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Guardar usuario con contraseña hasheada
    const idNuevo = await Usuario.crear(usuario, hashedPassword, rol);

    return res.status(201).json({ mensaje: 'Usuario creado', id: idNuevo });
  } catch (error) {
    console.error('Error creando usuario:', error.message);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};