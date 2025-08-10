class Inventario {
    static async obtenerTotales(conn) {
      // Total de materiales
      const [total] = await conn.query("SELECT COUNT(*) AS total FROM materiales");
  
      // Materiales disponibles
      const [disponibles] = await conn.query(
        "SELECT COUNT(*) AS disponibles FROM materiales WHERE cantidad_disponible > 0"
      );
  
      // Materiales prestados (con base en préstamos activos)
      const [prestados] = await conn.query(
        `SELECT COUNT(*) AS prestados 
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
  