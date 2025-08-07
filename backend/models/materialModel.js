const  pool = require('../config/db');

class Material {
  static async obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM materiales');
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM materiales WHERE id = ?', [id]);
    return rows[0];
  }

  static async crear(material) {
    const { nombre, tipo, cantidad_disponible, descripcion } = material;
    const [result] = await pool.query(
      'INSERT INTO materiales (nombre, tipo, cantidad_disponible, descripcion) VALUES (?, ?, ?, ?)',
      [nombre, tipo, cantidad_disponible, descripcion]
    );
    return result.insertId;
  }

  static async actualizar(id, material) {
    const { nombre, tipo, cantidad_disponible, descripcion } = material;
    const [result] = await pool.query(
      'UPDATE materiales SET nombre = ?, tipo = ?, cantidad_disponible = ?, descripcion = ? WHERE id = ?',
      [nombre, tipo, cantidad_disponible, descripcion, id]
    );
    return result.affectedRows;
  }

  static async eliminar(id) {
    const [result] = await pool.query('DELETE FROM materiales WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Material;
