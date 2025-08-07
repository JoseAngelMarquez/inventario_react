const pool = require('../config/db');
const PrestamosModel = require('../models/prestamosModel');

exports.prestarMaterial = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const {
      tipo, nombre_completo, matricula, carrera,
      lugar_trabajo, telefono, correo,
      id_material, cantidad, id_usuario
    } = req.body;

    // Verificar material
    const material = await PrestamosModel.verificarMaterial(conn, id_material);
    if (!material) {
      return res.status(404).json({ error: 'El material no existe' });
    }
    if (material.cantidad_disponible < cantidad) {
      return res.status(400).json({ error: 'No hay suficiente cantidad disponible' });
    }

    // Verificar o registrar solicitante
    let solicitante = await PrestamosModel.buscarSolicitante(conn, nombre_completo, tipo);
    let id_solicitante;
    if (solicitante) {
      id_solicitante = solicitante.id;
    } else {
      id_solicitante = await PrestamosModel.insertarSolicitante(conn, {
        tipo, nombre_completo, matricula, carrera,
        lugar_trabajo, telefono, correo
      });
    }

    // Registrar préstamo
    const idPrestamo = await PrestamosModel.insertarPrestamo(conn, {
      id_material, cantidad, id_usuario, id_solicitante
    });

    if (!idPrestamo) {
      return res.status(500).json({ error: 'Error al registrar el préstamo' });
    }

    // Actualizar inventario
    const filasActualizadas = await PrestamosModel.actualizarCantidadMaterial(conn, cantidad, id_material);
    if (filasActualizadas === 0) {
      return res.status(500).json({ error: 'Error al actualizar la cantidad del material' });
    }

    res.json({ mensaje: 'Préstamo registrado con éxito', idPrestamo });

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
};
