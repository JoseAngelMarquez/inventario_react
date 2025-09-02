class Material {

  
  /**
   * Obtiene todos los materiales de la base de datos.
   *
   * @static
   * @param {*} conn
   * @return {*} 
   * @memberof Material
   */
  static async obtenerTodos(conn) {
    const [rows] = await conn.query('SELECT * FROM materiales');
    return rows;
  }

  
  /**
   * Obtiene un material por su ID.
   *
   * @static
   * @param {*} conn
   * @param {*} id
   * @return {*} 
   * @memberof Material
   */
  static async obtenerPorId(conn, id) {
    const [rows] = await conn.query('SELECT * FROM materiales WHERE id = ?', [id]);
    return rows[0];
  }

  
  /**
   * Crea un nuevo material en la base de datos.
   *
   * @static
   * @param {*} conn
   * @param {*} material
   * @return {*} 
   * @memberof Material
   */
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
  

  /**
   *Actualiza un material existente en la base de datos.
   *
   * @static
   * @param {*} conn
   * @param {*} id
   * @param {*} material
   * @return {*} 
   * @memberof Material
   */
  static async actualizar(conn, id, material) {
    const { nombre, tipo, cantidad_disponible, descripcion } = material;
    const [result] = await conn.query(
      'UPDATE materiales SET nombre = ?, tipo = ?, cantidad_disponible = ?, descripcion = ? WHERE id = ?',
      [nombre, tipo, cantidad_disponible, descripcion, id]
    );
    return result.affectedRows;
  }

  
  /**
   * Elimina un material de la base de datos.
   *
   * @static
   * @param {*} conn
   * @param {*} id
   * @return {*} 
   * @memberof Material
   */
  static async eliminar(conn, id) {
    const [result] = await conn.query('DELETE FROM materiales WHERE id = ?', [id]);
    return result.affectedRows;
  }

  
  /**
   * Filtra materiales por nombre (búsqueda parcial).
   *
   * @static
   * @param {*} conn
   * @param {*} nombreMaterial
   * @return {*} 
   * @memberof Material
   */
  static async filtrarPorMaterial(conn, nombreMaterial) {
    const [rows] = await conn.query(
      'SELECT * FROM materiales WHERE nombre LIKE ?',
      [`%${nombreMaterial}%`]
    );
    return rows;
  }



}

module.exports = Material;
