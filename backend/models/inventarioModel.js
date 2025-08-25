
  

  class Inventario {
    static async obtenerTotales(conn) {
      // Total de materiales
      const [total] = await conn.query(
        `SELECT SUM(cantidad_disponible) AS total FROM materiales`
      );
  
      const [disponibles] = await conn.query(
        "SELECT COUNT(*) AS disponibles FROM materiales WHERE cantidad_disponible > 0"
      );
      // Materiales disponibles (mayor a 0)
     /*   const [disponiblesPorTipo] = await conn.query(
      `SELECT tipo, COUNT(*) AS disponibles
       FROM materiales
       WHERE cantidad_disponible > 0
       GROUP BY tipo`
    );
   */
      // Materiales prestados (con base en préstamos activos)
      const [prestados] = await conn.query(
        `SELECT SUM(cantidad) AS prestados 
         FROM prestamos 
         WHERE estado = 'prestado'`
      );
  
      return {
        totalMateriales: total[0].total,
        materialesDisponibles: disponibles[0].disponibles,
        materialesPrestados: prestados[0].prestados
      };
    }
  }
  
  module.exports = Inventario;
  