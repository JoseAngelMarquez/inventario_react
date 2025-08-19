const pool = require('../config/db');
const Prestamos = require('../models/prestamosModel');
const { enviarCorreo } = require('../utils/email');
require('dotenv').config();
const excelJS = require('exceljs');

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
  console.log('Sesión actual:', req.session.usuario);

  if (!req.session.usuario) {
    return res.status(401).json({ mensaje: 'No autorizado, inicia sesión' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const {
      tipo, nombre_completo, matricula, carrera, lugar_trabajo,
      telefono, correo, id_material, cantidad, fecha_prestamo
    } = req.body;

    // Insertar solicitante
    const [solicitanteResult] = await conn.query(
      `INSERT INTO solicitantes (tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tipo, nombre_completo, matricula || null, carrera || null, lugar_trabajo || null, telefono || null, correo]
    );
    const id_solicitante = solicitanteResult.insertId;

    // Bloquear material y verificar stock
    const [materialRows] = await conn.query(
      'SELECT cantidad_disponible, nombre FROM materiales WHERE id = ? FOR UPDATE',
      [id_material]
    );
    if (materialRows.length === 0) throw new Error('Material no encontrado');
    if (materialRows[0].cantidad_disponible < cantidad) throw new Error('No hay suficiente stock disponible');

    const id_usuario = req.session.usuario.id;

    // Insertar préstamo
    const [prestamoResult] = await conn.query(
      `INSERT INTO prestamos (id_material, cantidad, fecha_prestamo, id_usuario, id_solicitante, estado)
       VALUES (?, ?, ?, ?, ?, 'prestado')`,
      [id_material, cantidad, fecha_prestamo, id_usuario, id_solicitante]
    );
    const idPrestamo = prestamoResult.insertId;

    // Actualizar stock
    await conn.query(
      'UPDATE materiales SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?',
      [cantidad, id_material]
    );

    await conn.commit();

    // Enviar respuesta
    res.status(201).json({ mensaje: 'Préstamo creado', id: idPrestamo });

    // Enviar correo (fuera de la transacción)
    enviarCorreo(
      correo,
      'Confirmación de préstamo',
      `Hola ${nombre_completo},\n\nTu préstamo del material "${materialRows[0].nombre}" (cantidad: ${cantidad}) fue registrado correctamente el día ${fecha_prestamo}.\n\nGracias.`
    );
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    if (!res.headersSent) res.status(500).json({ error: 'Error al crear préstamo', detalle: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.finalizar = async (req, res) => {
  console.log('Sesión actual:', req.session.usuario);
  if (!req.session.usuario) {
    return res.status(401).json({ mensaje: 'No autorizado, inicia sesión' });
  }

  const idUsuarioFinaliza = req.session.usuario.id;
  const idPrestamo = req.params.id;

  let conn;
  try {
    conn = await pool.getConnection();

    // Finalizar el préstamo
    const resultado = await Prestamos.finalizarPrestamo(conn, idPrestamo, idUsuarioFinaliza);

    // Obtener datos del préstamo y solicitante para el correo
    const [prestamoRows] = await conn.query(
      `SELECT p.id, p.cantidad, p.fecha_prestamo, s.nombre_completo, s.correo, m.nombre AS material_nombre
       FROM prestamos p
       JOIN solicitantes s ON p.id_solicitante = s.id
       JOIN materiales m ON p.id_material = m.id
       WHERE p.id = ?`,
      [idPrestamo]
    );

    if (prestamoRows.length > 0) {
      const prestamo = prestamoRows[0];
      enviarCorreo(
        prestamo.correo,
        'Préstamo finalizado',
        `Hola ${prestamo.nombre_completo},\n\nTu préstamo del material "${prestamo.material_nombre}" (cantidad: ${prestamo.cantidad}) realizado el ${prestamo.fecha_prestamo} ha sido finalizado.\n\nGracias.`
      );
    } else {
      console.warn('No se encontró el préstamo para enviar correo.');
    }

    res.json({ mensaje: resultado.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al finalizar préstamo', detalle: error.message });
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

exports.exportarExcel = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const prestamos = await Prestamos.obtenerTodosConDetalles(conn);

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Préstamos');

    worksheet.columns = [
      { header: 'Solicitante', key: 'Solicitante', width: 30 },
      { header: 'Prestamista', key: 'Prestamista', width: 30 },
      { header: 'Finalizador', key: 'Finalizador', width: 30 },
      { header: 'Cantidad', key: 'Cantidad', width: 10 },
      { header: 'Fecha Préstamo', key: 'FechaPrestamo', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
      { header: 'Tipo Material', key: 'TipoMaterial', width: 20 },
      { header: 'Nombre', key: 'Nombre', width: 30 },
      { header: 'Devolución', key: 'Devolucion', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
    ];

    prestamos.forEach(prestamo => {
      worksheet.addRow(prestamo);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=prestamos.xlsx');

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Error exportando Excel:', error);
    res.status(500).send({ message: 'Error generando Excel', error: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.reporteCompleto = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const reporte = await Prestamos.obtenerReporteCompleto(conn);
    res.json(reporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reporte completo' });
  } finally {
    if (conn) conn.release();
  }
};
