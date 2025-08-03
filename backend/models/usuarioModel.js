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
}

module.exports = Usuario;
