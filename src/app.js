require('dotenv').config();
require('./db/mongose');
const express = require('express');
const app = express();
const tareasRoutes = require('./routers/tareasRoutes')

app.use(express.json());
app.use('/api/tareas', tareasRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});