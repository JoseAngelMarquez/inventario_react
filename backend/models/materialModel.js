class Material {
  static async obtenerTodos(conn) {
    const [rows] = await conn.query('SELECT * FROM materiales');
    return rows;
  }

  static async obtenerPorId(conn, id) {
    const [rows] = await conn.query('SELECT * FROM materiales WHERE id = ?', [id]);
    return rows[0];
  }

  static async crear(conn, material) {
    const { nombre, tipo, cantidad_disponible, descripcion } = material;
  
    // Verificar si ya existe
    const [rows] = await conn.query(
      'SELECT id FROM materiales WHERE nombre = ?',
      [nombre]
    );
  
    if (rows.length > 0) {
      throw new Error('El nombre del material ya existe');
    }
  
    // Si no existe, insertar
    const [result] = await conn.query(
      'INSERT INTO materiales (nombre, tipo, cantidad_disponible, descripcion) VALUES (?, ?, ?, ?)',
      [nombre, tipo, cantidad_disponible, descripcion]
    );
  
    return result.insertId;
  }
  

  static async actualizar(conn, id, material) {
    const { nombre, tipo, cantidad_disponible, descripcion } = material;
    const [result] = await conn.query(
      'UPDATE materiales SET nombre = ?, tipo = ?, cantidad_disponible = ?, descripcion = ? WHERE id = ?',
      [nombre, tipo, cantidad_disponible, descripcion, id]
    );
    return result.affectedRows;
  }

  static async eliminar(conn, id) {
    const [result] = await conn.query('DELETE FROM materiales WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async filtrarPorMaterial(conn, nombreMaterial) {
    const [rows] = await conn.query(
      'SELECT * FROM materiales WHERE nombre LIKE ?',
      [`%${nombreMaterial}%`]
    );
    return rows;
  }



}

module.exports = Material;
