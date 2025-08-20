const Usuario = require('../models/usuarioModel');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { param } = require('../routes/usuarios');
const { json } = require('express');

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

    //Se guarda en la cookie para posteriormente validar en cualquier controller que el usuario esté logueado
    if (match) {
      // Guardar datos en la sesión
      req.session.usuario = {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        rol: usuarioEncontrado.rol
      };

      return res.json({ mensaje: 'Login exitoso', usuario: req.session.usuario });
    } else {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  } finally {
    if (conn) conn.release();
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
    if (conn) conn.release(); 
  }
};


exports.obtenerUsuarios = async (req, res) => {
  const conn = await pool.getConnection();
  try{
    const usuarios = await Usuario.obtenerUsuarios(conn);
    res.json(usuarios);
  }catch(error){
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  } finally {
    if (conn) conn.release(); 
  }
}


exports.eliminarUsuario = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    const eliminarUsuario = await Usuario.eliminar(conn,id);
    if (eliminarUsuario === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
   res.json({ mensaje: 'Usuario eliminado exitosamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'No se puede eliminar este usuario porque ya realizó acciones en el sistema. ' });
  }finally {
    if (conn) conn.release();

}
}

exports.actualizarUsuario = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    const usuarioActualizado = req.body;
    const affectedRows = await Usuario.actualizar(conn, id, usuarioActualizado.contrasena, usuarioActualizado.rol); 
    res.json({ mensaje: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }finally {
    if (conn) conn.release(); 
  }
}

const pool = require('../config/db');
const Usuario = require('../models/usuarioModel');

exports.obtenerPaginados = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    // Valores por defecto
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const usuarios = await Usuario.obtenerPaginados(conn, limit, offset);
    const total = await Usuario.contarTotal(conn);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: usuarios
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios paginados' });
  } finally {
    if (conn) conn.release();
  }
};
exports.obtenerPaginados = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    // Valores por defecto
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const usuarios = await Usuario.obtenerPaginados(conn, limit, offset);
    const total = await Usuario.contarTotal(conn);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: usuarios
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios paginados' });
  } finally {
    if (conn) conn.release();
  }
};