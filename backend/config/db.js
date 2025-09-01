const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
// Crear pool de conexiones a la base de datos

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Máx. conexiones simultáneas
  queueLimit: 0 // 0 = sin límite de cola
});

// Probar conexión al iniciar la app
(async () => {
  try {
    const connection = await pool.getConnection();
    //console.log('Conectado a la base de datos MySQL');
    connection.release();
  } catch (error) {
    //console.error('Error al conectar a la base de datos MySQL:', error.message);
  }
})();
module.exports = pool;
