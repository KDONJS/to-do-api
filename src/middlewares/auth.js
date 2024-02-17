const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Busca un usuario con el ID decodificado y que tenga el token en su arreglo de tokens.
    const usuario = await Usuario.findOne({ 
      _id: decoded._id, 
      'tokens.token': token 
    });

    if (!usuario) {
      throw new Error('No se pudo encontrar el usuario con el token proporcionado.');
    }

    req.usuario = usuario;
    req.token = token; // Guarda el token en el request para uso posterior.
    next();
  } catch (error) {
    res.status(401).send({ error: 'Por favor autentícate.' });
  }
};

module.exports = auth;
