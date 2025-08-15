const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Configuración de CORS para frontend en otro puerto (por ejemplo localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Cambia esto por el dominio de tu frontend
  credentials: true // Permite enviar cookies con la sesión
}));

app.use(express.json());

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usas HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Rutas
const usuarioRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuarioRoutes);

const materialesRoutes = require('./routes/materialRoutes'); 
app.use('/api/materiales', materialesRoutes);

const prestamosRoutes = require('./routes/prestamosRoutes');
app.use('/api/prestamos', prestamosRoutes);

const inventarioRoutes = require("./routes/inventarioRoutes");
app.use("/api/inventario", inventarioRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
