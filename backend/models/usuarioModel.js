
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
      console.log("Intentando eliminar usuario id:", id);
  
      // Verificar préstamos activos
      const [prestamos] = await conn.query(
        'SELECT COUNT(*) AS total FROM prestamos WHERE id_usuario = ? AND estado = "prestado"',
        [id]
      );
  
      const totalPrestamos = Number(prestamos[0]?.total || 0);
      console.log("Préstamos activos encontrados:", totalPrestamos);
  
      if (totalPrestamos > 0) {
        throw new Error("El usuario tiene préstamos activos, no puede ser eliminado");
      }
  
      // Eliminar usuario
      const [result] = await conn.query('DELETE FROM usuarios WHERE id = ?', [id]);
      console.log("Resultado DELETE:", result);
      return result.affectedRows;
  
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
      throw error;
    }
  }
  
  
  


}
 
module.exports = Usuario;
