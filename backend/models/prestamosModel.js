class Prestamos {
  static async obtenerTodosConDetalles(conn) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        p.estado,
        s.nombre_completo AS nombre_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        m.descripcion AS descripcion_material,
        u.usuario AS usuario_prestamista
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u ON p.id_usuario = u.id
      ORDER BY p.fecha_prestamo DESC
    `);
    return rows;
  }

  static async obtenerPorId(conn, id) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        p.estado,
        s.nombre_completo AS nombre_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        m.descripcion AS descripcion_material,
        u.usuario AS usuario_prestamista
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u ON p.id_usuario = u.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async crear(conn, prestamo) {
    // Datos del solicitante (nuevo)
    const {
      tipo,
      nombre_completo,
      matricula = null,
      carrera = null,
      lugar_trabajo = null,
      telefono = null,
      correo = null,
  
      // Datos del préstamo
      id_material,
      cantidad,
      fecha_prestamo,
      fecha_devolucion = null,
      id_usuario
    } = prestamo;
  
    // Insertar el solicitante
    const [resultSolicitante] = await conn.query(`
      INSERT INTO solicitantes (tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo]);
  
    const id_solicitante = resultSolicitante.insertId;
  
    // Insertar el préstamo con el id_solicitante recién creado
    const [resultPrestamo] = await conn.query(`
      INSERT INTO prestamos (id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante]);
  
    // Actualizas la cantidad disponible del material
    await conn.query(`
      UPDATE materiales SET cantidad_disponible = cantidad_disponible - ?
      WHERE id = ?
    `, [cantidad, id_material]);
  
    return resultPrestamo.insertId;
  }
  

  static async actualizar(conn, id, prestamo) {
    const { id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion, estado, id_usuario } = prestamo;

    // Actualiza todos los campos necesarios, incluidos id_usuario y estado
    const [result] = await conn.query(`
      UPDATE prestamos
      SET id_solicitante = ?, id_material = ?, cantidad = ?, fecha_prestamo = ?, fecha_devolucion = ?, estado = ?, id_usuario = ?
      WHERE id = ?
    `, [id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion, estado, id_usuario, id]);

    return result.affectedRows;
  }

  static async eliminar(conn, id) {
    // Obtener info del préstamo antes de eliminar para devolver cantidad
    const [rows] = await conn.query(`SELECT id_material, cantidad FROM prestamos WHERE id = ?`, [id]);
    const prestamo = rows[0];
    if (!prestamo) return false;

    // Eliminar préstamo
    await conn.query(`DELETE FROM prestamos WHERE id = ?`, [id]);

    // Devolver cantidad al inventario
    await conn.query(`
      UPDATE materiales SET cantidad_disponible = cantidad_disponible + ?
      WHERE id = ?
    `, [prestamo.cantidad, prestamo.id_material]);

    return true;
  }
}

module.exports = Prestamos;
