const pool = require('../config/db');
const Prestamos = require('../models/prestamosModel');
const nodemailer = require('nodemailer');
const validator = require('validator');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'joseangelmarquezespina060503@gmail.com',
    pass: 'iikd vkkn ksib rsib',
  },
});

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

    const {
      correo, nombre_completo, id_material, cantidad, fecha_prestamo
    } = req.body;

    const id = await Prestamos.crear(conn, req.body);

    // Obtén nombre del material para el correo
    const [rows] = await conn.query('SELECT nombre FROM materiales WHERE id = ?', [id_material]);
    const nombre_material = rows.length > 0 ? rows[0].nombre : 'Material desconocido';

    // Envías respuesta al cliente
    res.status(201).json({ mensaje: 'Préstamo creado', id });

    // Prepara y envía correo de forma asíncrona (no bloquea respuesta)
    const mailOptions = {
      from: 'joseangelmarquezespina060503@gmail.com',
      to: correo,
      subject: 'Confirmación de préstamo',
      text: `
        Hola ${nombre_completo},

        Tu préstamo del material ${nombre_material} (cantidad: ${cantidad}) fue registrado correctamente el día ${fecha_prestamo}.

        Gracias.
      `,
    };

    transporter.sendMail(mailOptions).catch(err => {
      console.error('Error enviando correo:', err);
    });

  } catch (error) {
    console.error(error);
    // Aquí verifica que la respuesta NO haya sido enviada antes
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error al crear préstamo', detalle: error.message });
    }
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

/* exports.eliminar = async (req, res) => {
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

}; */

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

exports.exportarExcel = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const prestamos = await Prestamos.obtenerTodosConDetalles(conn);

    console.log('Prestamos para Excel:', prestamos); // Verifica datos

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Préstamos');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Solicitante', key: 'nombre_solicitante', width: 30 },
      { header: 'Material', key: 'nombre_material', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Fecha Préstamo', key: 'fecha_prestamo', width: 20 },
      { header: 'Fecha Devolución', key: 'fecha_devolucion', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 }
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

