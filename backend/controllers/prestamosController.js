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
  if (!req.session.usuario) {
    return res.status(401).json({ mensaje: 'No autorizado, inicia sesión' });
  }

  let conn;
  try {
    conn = await pool.getConnection(); 
    const resultado = await Prestamos.crear(conn, {
      ...req.body,
      id_usuario: req.session.usuario.id
    });

    res.status(201).json({ mensaje: 'Préstamo creado', id: resultado.idPrestamo });

    // Enviar correo fuera de la transacción
    enviarCorreo(
      resultado.correoSolicitante,
      'Confirmación de préstamo',
      `Hola ${resultado.nombreSolicitante},\n\nTu préstamo del material "${resultado.nombreMaterial}" (cantidad: ${resultado.cantidad}) fue registrado correctamente el día ${req.body.fecha_prestamo}.\n\nGracias.`
    );

  } catch (error) {
    console.error('Error al crear préstamo:', error);
    if (!res.headersSent)
      res.status(500).json({ error: 'Error al crear préstamo', detalle: error.message });
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

    // Lógica de BD centralizada en el model
    const resultado = await Prestamos.finalizarPrestamo(conn, idPrestamo, idUsuarioFinaliza);

    // Si se obtuvo info del préstamo, enviar correo
    if (resultado.prestamo) {
      const p = resultado.prestamo;
      enviarCorreo(
        p.correo,
        'Préstamo finalizado',
        `Hola ${p.nombre_completo},\n\nTu préstamo del material "${p.material_nombre}" (cantidad: ${p.cantidad}) realizado el ${p.fecha_prestamo} ha sido finalizado.\n\nGracias.`
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

exports.filtrarPrestamos = async (req, res) => {
  let conn;
   try {
     conn = await pool.getConnection();

     // Tomamos los filtros del query string (?solicitante=Juan&material=Martillo)
     const { solicitante, material, fecha } = req.query;
 
     // Llamamos al modelo pasándole un objeto con los filtros
     const resultados = await Prestamos.filtrarPrestamos(conn, {
       solicitante,
       material,
       fecha,
     });
 
     conn.release();
 
     // Enviamos los resultados al cliente
     res.json(resultados);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Error al filtrar préstamos" });
   }finally{
     if (conn) conn.release();
   }
 };