const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuarioRoutes);

const materialesRoutes = require('./routes/materialRoutes'); 
app.use('/api/materiales', materialesRoutes);

const prestamosRoutes = require('./routes/prestamosRoutes');
app.use('/api/prestamos', prestamosRoutes);

const inventarioRoutes = require("./routes/inventarioRoutes");
app.use("/api/inventario", inventarioRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
