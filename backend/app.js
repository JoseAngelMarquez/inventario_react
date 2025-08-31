const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE)
  }
}));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/materiales', require('./routes/materialRoutes'));
app.use('/api/prestamos', require('./routes/prestamosRoutes'));
app.use('/api/inventario', require('./routes/inventarioRoutes'));

// Inicio del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  //console.log(`Servidor corriendo en puerto ${PORT}`);
});
