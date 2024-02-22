require('dotenv').config();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

const auth = async (req, res, next) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send({ error: 'Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!usuario) {
      throw new Error('Usuario no encontrado con el token proporcionado');
    }

    // Si el usuario es encontrado, pasa al siguiente middleware
    req.usuario = usuario;
    req.token = token;
    next();
  } catch (error) {
    // Captura y maneja errores específicos de JWT además de otros errores
    console.error('Error en auth middleware:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Token inválido.' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expirado.' });
    } else {
      return res.status(401).send({ error: 'Por favor autentícate.' });
    }
  }
};

module.exports = auth;