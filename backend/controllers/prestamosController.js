const pool = require('../config/db');
const Prestamos = require('../models/prestamosModel');

exports.obtenerTodos = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const prestamos = await Prestamos.obtenerTodosConDetalles(conn);
    res.json(prestamos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener préstamos' });
  } finally {
    if (conn) conn.release();
  }
};

exports.obtenerPorId = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const prestamo = await Prestamos.obtenerPorId(conn, req.params.id);
    if (!prestamo) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json(prestamo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener préstamo' });
  } finally {
    if (conn) conn.release();
  }
};

exports.crear = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const id = await Prestamos.crear(conn, req.body);
    res.status(201).json({ mensaje: 'Préstamo creado', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear préstamo', detalle: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.actualizar = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const actualizado = await Prestamos.actualizar(conn, req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json({ mensaje: 'Préstamo actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar préstamo' });
  } finally {
    if (conn) conn.release();
  }
};

exports.eliminar = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const eliminado = await Prestamos.eliminar(conn, req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json({ mensaje: 'Préstamo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar préstamo' });
  } finally {
    if (conn) conn.release();
  }

};

exports.finalizar = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const idPrestamo = req.params.id;

    // Aquí obtén el id del usuario que finaliza. Por ahora lo fijo en 1 para pruebas:
    const idUsuarioFinaliza = 1;

    const resultado = await Prestamos.finalizarPrestamo(conn, idPrestamo, idUsuarioFinaliza);
    res.json({ mensaje: resultado.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al finalizar préstamo', detalle: error.message });
  } finally {
    if (conn) conn.release();
  }
};

