const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Conectado a MongoDB Atlas'))
  .catch((err) => console.error(' Error de conexión a MongoDB:', err.message));

app.get('/', (req, res) => {
  res.send('¡El servidor está funcionando y conectado a la BD!');
});

// Aquí conectamos las rutas
const tareasRoutes = require('./routes/tareas');
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en el puerto ${PORT}`);
});