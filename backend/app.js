const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuarioRoutes);

const materialesRoutes = require('./routes/materialRoutes'); // Ojo: que el nombre sea exacto
app.use('/api/materiales', materialesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
