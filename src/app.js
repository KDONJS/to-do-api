require('dotenv').config();
require('./db/mongose');
const express = require('express');
const app = express();
const tareasRoutes = require('./routers/tareasRoutes')

app.use(express.json());
app.use('/api/tareas', tareasRoutes);

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