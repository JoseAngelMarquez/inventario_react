const pool = require('../config/db');

const PrestamosModel = {
  async verificarMaterial(conn, id_material) {
    const [rows] = await conn.query(
      'SELECT cantidad_disponible FROM materiales WHERE id = ?',
      [id_material]
    );
    return rows[0];
  },

  async buscarSolicitante(conn, nombre_completo, tipo) {
    const [rows] = await conn.query(
      'SELECT id FROM solicitantes WHERE nombre_completo = ? AND tipo = ?',
      [nombre_completo, tipo]
    );
    return rows[0];
  },

  async insertarSolicitante(conn, data) {
    const [result] = await conn.query(
      `INSERT INTO solicitantes 
      (tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.tipo,
        data.nombre_completo,
        data.matricula,
        data.carrera,
        data.lugar_trabajo,
        data.telefono,
        data.correo
      ]
    );
    return result.insertId;
  },

  async insertarPrestamo(conn, data) {
    await conn.query(
      `INSERT INTO prestamos 
      (id_material, cantidad, fecha_prestamo, estado, id_usuario, id_solicitante) 
      VALUES (?, ?, NOW(), 'prestado', ?, ?)`,
      [data.id_material, data.cantidad, data.id_usuario, data.id_solicitante]
    );
  },

  async actualizarCantidadMaterial(conn, cantidad, id_material) {
    await conn.query(
      'UPDATE materiales SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?',
      [cantidad, id_material]
    );
  }
};

module.exports = { pool, PrestamosModel };
