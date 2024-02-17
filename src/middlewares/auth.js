const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findOne({ _id: decoded._id });

      if (!usuario) {
        throw new Error('Usuario no encontrado.');
      }

      req.usuario = usuario;
      req.token = token; // Opcional, solo si necesitas el token más adelante.
      next();
    } catch (error) {
      res.status(401).send({ error: 'Por favor autentícate.' });
    }
};

module.exports = auth;
