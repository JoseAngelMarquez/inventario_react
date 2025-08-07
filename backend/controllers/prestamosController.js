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

    // 1. Verificar material
    const material = await PrestamosModel.verificarMaterial(conn, id_material);
    if (!material) throw new Error('El material no existe');
    if (material.cantidad_disponible < cantidad)
      throw new Error('No hay suficiente cantidad disponible');

    // 2. Verificar o registrar solicitante
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

    // 3. Registrar préstamo
    await PrestamosModel.insertarPrestamo(conn, {
      id_material, cantidad, id_usuario, id_solicitante
    });

    // 4. Actualizar inventario
    await PrestamosModel.actualizarCantidadMaterial(conn, cantidad, id_material);

    res.json({ mensaje: '✅ Préstamo registrado con éxito' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
};
