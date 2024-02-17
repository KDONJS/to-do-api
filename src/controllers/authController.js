require('dotenv').config();
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    usuario.password = await bcrypt.hash(usuario.password, 8);
    await usuario.save();
    const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET);
    res.status(201).send({ usuario, token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ error: 'Datos de entrada inválidos.' });
    }
    console.error('Error al registrar el usuario:', error);
    res.status(500).send({ error: 'Error interno del servidor al registrar usuario.' });
  }
};


exports.iniciarSesionUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) {
      return res.status(400).send({ error: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(req.body.password, usuario.password);
    if (isMatch) {
      res.send({ message: 'Inicio de sesión exitoso.' });
    } else {
      res.status(400).send({ error: 'Contraseña incorrecta.' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al iniciar sesión.' });
  }
};