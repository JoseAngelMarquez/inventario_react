const pool = require('../config/db');
const Prestamos = require('../models/prestamosModel');
const nodemailer = require('nodemailer');

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
    const id = await Prestamos.crear(conn, req.body);

    // Respondes inmediatamente al cliente
    res.status(201).json({ mensaje: 'Préstamo creado', id });

    // Extraemos datos para el correo (puedes hacerlo antes o después de responder)
    const { correo, nombre_completo, id_material, cantidad, fecha_prestamo } = req.body;

    // Configura el email
    const mailOptions = {
      from: 'tucorreo@gmail.com',
      to: correo,
      subject: 'Confirmación de préstamo',
      text: `
        Hola ${nombre_completo},

        Tu préstamo del material con ID ${id_material} (cantidad: ${cantidad}) fue registrado correctamente el día ${fecha_prestamo}.

        Gracias.
      `,
    };

    // Enviar el correo de forma asíncrona, no bloquea la respuesta
    transporter.sendMail(mailOptions).catch(err => {
      console.error('Error enviando correo:', err);
    });

  } catch (error) {
    console.error(error);
    // Si falla la creación, devuelves error
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

