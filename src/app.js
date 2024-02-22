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
      :root {
        --color-fondo: #121212;
        --color-primario: #bb86fc;
        --color-secundario: #03dac6;
        --color-texto: #e0e0e0;
        --color-sombra: rgba(0, 0, 0, 0.2);
      }
      body {
        font-family: 'Roboto', Arial, sans-serif;
        text-align: center;
        margin-top: 50px;
        background-color: var(--color-fondo);
        color: var(--color-texto);
      }
      h1 {
        color: var(--color-primario);
        margin-bottom: 24px;
      }
      p {
        color: var(--color-texto);
      }
      .endpoint {
        background-color: #1e1e1e;
        padding: 20px;
        margin: 20px auto;
        width: 90%;
        max-width: 800px;
        border-radius: 8px;
        box-shadow: 0 4px 6px var(--color-sombra);
        transition: transform 0.3s ease;
      }
      .endpoint:hover {
        transform: translateY(-5px);
      }
      .endpoint h2 {
        color: var(--color-secundario);
      }
      .endpoint p {
        margin: 10px 0;
        line-height: 1.6;
      }
      @media (min-width: 768px) {
        .endpoint {
          width: 80%;
        }
      }
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