class Prestamos {
  static async obtenerTodosConDetalles(conn) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        s.nombre_completo AS nombre_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        m.descripcion AS descripcion_material
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
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
        s.nombre_completo AS nombre_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        m.descripcion AS descripcion_material
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async crear(conn, prestamo) {
    const { id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion } = prestamo;
    const [result] = await conn.query(`
      INSERT INTO prestamos (id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion)
      VALUES (?, ?, ?, ?, ?)
    `, [id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion]);

    // Disminuir cantidad disponible en materiales
    await conn.query(`
      UPDATE materiales SET cantidad_disponible = cantidad_disponible - ?
      WHERE id = ?
    `, [cantidad, id_material]);

    return result.insertId;
  }

  static async actualizar(conn, id, prestamo) {
    const { id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion } = prestamo;
    const [result] = await conn.query(`
      UPDATE prestamos 
      SET id_solicitante = ?, id_material = ?, cantidad = ?, fecha_prestamo = ?, fecha_devolucion = ?
      WHERE id = ?
    `, [id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion, id]);

    return result.affectedRows;
  }

  static async eliminar(conn, id) {
    // Primero obtenemos el préstamo
    const [rows] = await conn.query(`SELECT id_material, cantidad FROM prestamos WHERE id = ?`, [id]);
    const prestamo = rows[0];

    // Eliminamos el préstamo
    await conn.query(`DELETE FROM prestamos WHERE id = ?`, [id]);

    // Regresamos el material disponible
    await conn.query(`
      UPDATE materiales SET cantidad_disponible = cantidad_disponible + ?
      WHERE id = ?
    `, [prestamo.cantidad, prestamo.id_material]);

    return true;
  }
}

module.exports = Prestamos;
