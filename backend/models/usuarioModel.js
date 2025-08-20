
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

  static async eliminar(conn, id) {
    try {
      // Verificar si el usuario tiene préstamos
      const [prestamos] = await conn.query('SELECT COUNT(*) AS total FROM prestamos WHERE id_usuario = ?', [id]);
      if (prestamos[0].total > 0) {
        throw new Error("El usuario tiene préstamos activos, no puede ser eliminado");
      }
  
      // Eliminar usuario si no tiene préstamos
      const [result] = await conn.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
  


}
 
module.exports = Usuario;
