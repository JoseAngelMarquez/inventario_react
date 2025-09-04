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
    //console.error(error);
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
    //console.error(error);
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

    const correoAdmin = process.env.ADMIN_EMAIL;
    enviarCorreo(
      correoAdmin,
      'Nuevo préstamo registrado',
      `El usuario ${resultado.nombreSolicitante} ha solicitado un préstamo del material "${resultado.nombreMaterial}" (cantidad: ${resultado.cantidad}) el día ${req.body.fecha_prestamo}.\n\nRevisa el sistema para más detalles.`
    );


  } catch (error) {
    //console.error('Error al crear préstamo:', error);
    if (!res.headersSent)
      res.status(500).json({ error: 'Error al crear préstamo', detalle: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.finalizar = async (req, res) => {
  //console.log('Sesión actual:', req.session.usuario);
  if (!req.session.usuario) {
    return res.status(401).json({ mensaje: 'No autorizado, inicia sesión' });
  }

  const idUsuarioFinaliza = req.session.usuario.id;
  const idPrestamo = req.params.id;

  // Convertir a booleano seguro
  const insumoTerminado = req.body.insumoTerminado === true || req.body.insumoTerminado === 'true';

  let conn;
  try {
    conn = await pool.getConnection();

    // Pasar el valor de insumoTerminado al model
    const resultado = await Prestamos.finalizarPrestamo(conn, idPrestamo, idUsuarioFinaliza, insumoTerminado);

    if (resultado.prestamo) {
      const p = resultado.prestamo;
      enviarCorreo(
        p.correo,
        'Préstamo finalizado',
        `Hola ${p.nombre_solicitante},\n\nTu préstamo del material "${p.nombre_material}" (cantidad: ${p.cantidad}) realizado el ${p.fecha_prestamo} ha sido finalizado.\n\nGracias.`
      );

      const correoAdmin = process.env.ADMIN_EMAIL;
      enviarCorreo(
        correoAdmin,
        'Préstamo finalizado - Información',
        `El usuario ${p.nombre_solicitante} ha finalizado un préstamo del material "${p.nombre_material}" (cantidad: ${p.cantidad}) realizado el ${p.fecha_prestamo}.\n\nRevisa el sistema para más detalles.`
      );

    } else {
      //console.warn('No se encontró el préstamo para enviar correo.');
    }

    res.json({ mensaje: resultado.message });

  } catch (error) {
    //console.error(error);
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
    //console.error(error);
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
      { header: 'Solicitante', key: 'nombre_solicitante', width: 30 },
      { header: 'Prestamista', key: 'usuario_prestamista', width: 30 },
      { header: 'Finalizador', key: 'usuario_finalizador', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Fecha Préstamo', key: 'fecha_prestamo', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
      { header: 'Tipo Material', key: 'tipo_material', width: 20 },
      { header: 'Nombre', key: 'nombre_material', width: 30 },
      { header: 'Devolución', key: 'fecha_devolucion', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
    ];

    prestamos.forEach(prestamo => {
      worksheet.addRow({
        nombre_solicitante: prestamo.nombre_solicitante || 'Sin solicitante',
        usuario_prestamista: prestamo.usuario_prestamista || 'Desconocido',
        usuario_finalizador: prestamo.usuario_finalizador || 'No finalizado',
        cantidad: prestamo.cantidad,
        fecha_prestamo: prestamo.fecha_prestamo ? new Date(prestamo.fecha_prestamo) : null,
        tipo_material: prestamo.tipo_material || 'Sin tipo',
        nombre_material: prestamo.nombre_material || 'Sin nombre',
        fecha_devolucion: prestamo.fecha_devolucion ? new Date(prestamo.fecha_devolucion) : null,
      });
    });

    // Cabeceras para descargar como Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=prestamos.xlsx');

    await workbook.xlsx.write(res);
    res.status(200).end();

  } catch (error) {
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
    //console.error(error);
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
    //console.error(error);
    res.status(500).json({ error: "Error al filtrar préstamos" });
  } finally {
    if (conn) conn.release();
  }




};

exports.filtrarPorFecha = async (req, res) => {
  try {
    const fecha = req.query.fecha; // ejemplo: /filtroFecha?fecha=2025-08-29
    const conn = await pool.getConnection();
    const resultados = await Prestamos.filtrarPorFecha(conn, fecha);
    conn.release();

    if (!resultados.length) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json(resultados);

  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


