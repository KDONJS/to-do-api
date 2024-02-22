require('dotenv').config();
require('./db/mongose'); // Asegúrate de que la ruta esté correcta
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
// Importa los enrutadores
const tareasRoutes = require('./routers/tareasRoutes');
const authRoutes = require('./routers/authRoutes'); // Asegúrate de que esta ruta esté correcta

app.use(express.json());

// Usa los enrutadores con su ruta base respectiva
app.use('/api/tareas', tareasRoutes);
app.use('/api/auth', authRoutes); // Añade esta línea para incluir las rutas de autenticación

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a mi API de Tareas</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        h1 { color: #333; }
        p { color: #666; }
      </style>
    </head>
    <body>
      <h1>Bienvenido a mi API de Tareas - (${process.env.AMBIENTE})</h1>
      <p>Usa los endpoints para gestionar tus tareas.</p>
    </body>
    </html>
  `);
});

  
module.exports = app;