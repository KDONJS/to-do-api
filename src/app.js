require('dotenv').config();
require('./db/mongose');
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./config/swaggerDef');
const fs = require('fs');
const path = require('path');

app.use(express.json());

const options = {
  swaggerDefinition,
  apis: ['./src/routers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const tareasRoutes = require('./routers/tareasRoutes');
const authRoutes = require('./routers/authRoutes');

app.use('/api/tareas', tareasRoutes);
app.use('/api/auth', authRoutes);

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
