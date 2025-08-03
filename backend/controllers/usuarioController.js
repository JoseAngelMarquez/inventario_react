const Usuario = require('../models/usuarioModel');

exports.login = (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }

  Usuario.buscarPorUsuario(usuario, (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

    if (resultados.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioEncontrado = resultados[0];

    // Validación directa (sin hash)
    if (usuarioEncontrado.contrasena === contrasena) {
      return res.json({ mensaje: 'Login exitoso', usuario: usuarioEncontrado });
    } else {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
  });
};
