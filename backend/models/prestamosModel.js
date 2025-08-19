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
        u_presto.usuario AS usuario_prestamista,
        u_finalizo.usuario AS usuario_finalizador
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u_presto ON p.id_usuario = u_presto.id
      LEFT JOIN usuarios u_finalizo ON p.id_finalizado_por = u_finalizo.id
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
  // Crear préstamo y actualizar stock
  static async crear(conn, prestamo) {
    const {
      tipo,
      nombre_completo,
      matricula = null,
      carrera = null,
      lugar_trabajo = null,
      telefono = null,
      correo = null,
      id_material,
      cantidad,
      fecha_prestamo,
      fecha_devolucion = null,
      id_usuario
    } = prestamo;

    await conn.beginTransaction();
    try {
      // Insertar solicitante
      const [resultSolicitante] = await conn.query(`
        INSERT INTO solicitantes (tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo]);
      const id_solicitante = resultSolicitante.insertId;

      // Verificar stock y bloquear fila
      const [materialRows] = await conn.query(
        'SELECT cantidad_disponible, nombre FROM materiales WHERE id = ? FOR UPDATE',
        [id_material]
      );
      if (materialRows.length === 0) throw new Error('Material no encontrado');
      if (materialRows[0].cantidad_disponible < cantidad)
        throw new Error('No hay suficiente stock disponible');

      // Insertar préstamo
      const [resultPrestamo] = await conn.query(`
        INSERT INTO prestamos (id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante, estado)
        VALUES (?, ?, ?, ?, ?, ?, 'prestado')
      `, [id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante]);

      // Actualizar stock
      await conn.query(`
        UPDATE materiales
        SET cantidad_disponible = cantidad_disponible - ?
        WHERE id = ?
      `, [cantidad, id_material]);

      await conn.commit();
      return {
        idPrestamo: resultPrestamo.insertId,
        nombreMaterial: materialRows[0].nombre,
        correoSolicitante: correo,
        nombreSolicitante: nombre_completo,
        cantidad
      };

    } catch (error) {
      await conn.rollback();
      throw error;
    }
  }

  // Finalizar préstamo y devolver stock
  static async finalizarPrestamo(conn, idPrestamo, idUsuarioFinaliza) {
    await conn.beginTransaction();
    try {
      const [prestamoRows] = await conn.query(
        'SELECT id_material, cantidad, estado FROM prestamos WHERE id = ? FOR UPDATE',
        [idPrestamo]
      );
      if (prestamoRows.length === 0) throw new Error('Préstamo no encontrado');
      if (prestamoRows[0].estado === 'finalizado')
        throw new Error('El préstamo ya está finalizado');

      // Actualizar préstamo a finalizado
      await conn.query(`
        UPDATE prestamos
        SET estado = 'finalizado',
            id_finalizado_por = ?,
            fecha_devolucion = NOW()
        WHERE id = ?
      `, [idUsuarioFinaliza, idPrestamo]);

      // Devolver stock
      await conn.query(`
        UPDATE materiales
        SET cantidad_disponible = cantidad_disponible + ?
        WHERE id = ?
      `, [prestamoRows[0].cantidad, prestamoRows[0].id_material]);

      await conn.commit();
      return { message: 'Préstamo finalizado y stock actualizado correctamente' };

    } catch (error) {
      await conn.rollback();
      throw error;
    }
  }



  static async obtenerReporteCompleto(conn) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        s.nombre_completo AS solicitante,
        u_presto.usuario AS prestamista,
        u_finalizo.usuario AS finalizador,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        m.tipo AS tipo_material,
        m.nombre AS nombre_material
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN usuarios u_presto ON p.id_usuario = u_presto.id
      LEFT JOIN usuarios u_finalizo ON p.id_finalizado_por = u_finalizo.id
      JOIN materiales m ON p.id_material = m.id
      ORDER BY p.fecha_prestamo DESC
    `);
    return rows;
  }
  

}


module.exports = Prestamos;
