
class Usuario {
  static async buscarPorUsuario(conn, usuario) {
    const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return rows;
  }

  static async crear(conn, usuario, contrasena, rol) {
    const [result] = await conn.query(
      'INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)',
      [usuario, contrasena, rol]
    );
    return result.insertId;
  }

  static async obtenerUsuarios(conn) {
    const [rows] = await conn.query('SELECT * FROM usuarios');
    return rows.map(row => ({id:row.id, usuario: row.usuario, rol: row.rol}));

  }
}
 
module.exports = Usuario;
