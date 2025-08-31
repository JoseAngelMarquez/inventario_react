
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
      //console.log("Intentando eliminar usuario id:", id);
  
      // Verificar préstamos activos
      const [prestamos] = await conn.query(
        'SELECT COUNT(*) AS total FROM prestamos WHERE id_usuario = ? AND estado = "prestado"',
        [id]
      );
  
      const totalPrestamos = Number(prestamos[0]?.total || 0);
      //console.log("Préstamos activos encontrados:", totalPrestamos);
  
      if (totalPrestamos > 0) {
        throw new Error("El usuario tiene préstamos activos, no puede ser eliminado");
      }
  
      // Eliminar usuario
      const [result] = await conn.query('DELETE FROM usuarios WHERE id = ?', [id]);
      //console.log("Resultado DELETE:", result);
      return result.affectedRows;
  
    } catch (error) {
      //console.error("Error al eliminar usuario:", error.message);
      throw error;
    }
  }
  
  static async actualizar(conn, id, usuario, contrasena, rol) {
    try {
      // Validar que id sea un número
      const idNum = Number(id);
      if (isNaN(idNum)) {
        throw new Error("ID inválido: debe ser un número");
      }
  
      // Validar que usuario, contrasena y rol no estén vacíos
      if (!usuario || !contrasena || !rol) {
        throw new Error("Faltan datos para actualizar el usuario");
      }
  
      const [result] = await conn.query(
        'UPDATE usuarios SET usuario = ?, contrasena = ?, rol = ? WHERE id = ?',
        [usuario, contrasena, rol, idNum]
      );
      return result.affectedRows;
    } catch (error) {
      //console.error("Error al actualizar usuario:", error.message);
      throw error; // Propagar el error para que el controller lo maneje
    }
  }
  

  static async obtenerPaginados(conn, limit, offset) {
    const [rows] = await conn.query(
      'SELECT id, usuario, rol FROM usuarios ORDER BY id LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows; 
  }
  

  static async contarTotal(conn) {
    const [rows] = await conn.query('SELECT COUNT(*) AS total FROM usuarios');
    return rows[0].total;
  }
}


module.exports = Usuario;
