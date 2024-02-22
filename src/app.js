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
      body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #121212; color: #e0e0e0; }
      h1 { color: #bb86fc; }
      p { color: #b0b0b0; }
      .endpoint { background-color: #333333; padding: 10px; margin: 20px auto; width: 80%; border-radius: 8px; }
      .endpoint h2 { color: #03dac5; }
      .endpoint p { color: #e0e0e0; }
    </style>
  </head>
  <body>
    <h1>Bienvenido a mi API de Tareas - (${process.env.AMBIENTE})</h1>
    <p>Usa los endpoints para gestionar tus tareas.</p>
    
    <div class="endpoint">
      <h2>Endpoints de Autenticación</h2>
      <p><strong>POST /auth/registro</strong> - Registrar un nuevo usuario</p>
      <p><strong>POST /auth/login</strong> - Iniciar sesión</p>
      <p><strong>POST /auth/logout</strong> - Cerrar sesión</p>
      <p><strong>PATCH /auth/me</strong> - Editar usuario</p>
      <p><strong>DELETE /auth/me</strong> - Eliminar usuario</p>
    </div>
    
    <div class="endpoint">
      <h2>Endpoints de Tareas</h2>
      <p><strong>GET /tareas/</strong> - Listar todas las tareas</p>
      <p><strong>POST /tareas/</strong> - Crear una nueva tarea</p>
      <p><strong>POST /tareas/:id/subtareas</strong> - Añadir una subtarea a una tarea existente</p>
      <p><strong>PUT /tareas/:id</strong> - Actualizar una tarea existente</p>
      <p><strong>PUT /tareas/:id/subtareas</strong> - Actualizar una subtarea</p>
      <p><strong>DELETE /tareas/:id</strong> - Eliminar una tarea</p>
      <p><strong>DELETE /tareas/:id/subtareas/:subtareaId</strong> - Eliminar una subtarea</p>
    </div>
  </body>
  </html>
`);
});

  
module.exports = app;