const express = require('express');
const cors = require('cors');


const app = express();
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const usuarioRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuarioRoutes);

const materialRoutes = require('./routes/materialRoutes');
app.use('/api/materiales', materialRoutes);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
