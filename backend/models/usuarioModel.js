const pool = require('../config/db');

class Usuario {
  static async buscarPorUsuario(usuario) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async crear(usuario, contrasena, rol) {
    try {
      const [result] = await pool.query(
        'INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)',
        [usuario, contrasena, rol]
      );
      return result.insertId; // Retorna el ID del nuevo usuario creado
    } catch (error) {
      throw error;
    }
  }

}


module.exports = Usuario;
