const db = require('../config/db');

const Usuario = {
  buscarPorUsuario: (usuario, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(sql, [usuario], callback);
  }
};

module.exports = Usuario;
