require('dotenv').config();
require('./db/mongose');
const express = require('express');
const app = express();
const tareasRoutes = require('./routers/tareasRoutes')

app.use(express.json());
app.use('/api/tareas', tareasRoutes);

module.exports = app;
