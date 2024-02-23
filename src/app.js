require('dotenv').config();
require('./db/mongose'); // Asegúrate de que la ruta esté correcta
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
// Importa los enrutadores
const tareasRoutes = require('./routers/tareasRoutes');
const authRoutes = require('./routers/authRoutes');
const fs = require('fs');
const path = require('path');

app.use(express.json());

// Usa los enrutadores con su ruta base respectiva
app.use('/api/tareas', tareasRoutes);
app.use('/api/auth', authRoutes); // Añade esta línea para incluir las rutas de autenticación

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'view', 'bienvenida.html');

  fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    
    const result = data.replace('{AMBIENTE}', process.env.AMBIENTE);
    
    res.send(result);
  });
});

  
module.exports = app;