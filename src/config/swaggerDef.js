require('dotenv').config();

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'API TO-DO',
      version: '1.0.0',
      description: 'Documentación utilizando Swagger',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: `Servidor de ${process.env.AMBIENTE}`,
      },
    ],
  };
  
  module.exports = swaggerDefinition;