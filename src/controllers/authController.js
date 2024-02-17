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
      console.log('Usuario no encontrado con el email:', req.body.email);
      return res.status(400).send({ error: 'Datos de inicio de sesión inválidos' });
    }

    console.log('Password de la petición:', req.body.password);
    console.log('Hash de la contraseña en la base de datos:', usuario.password);

    const isMatch = await bcrypt.compare(req.body.password, usuario.password);
    if (!isMatch) {
      console.log('Contraseña incorrecta para el usuario:', req.body.email);
      return res.status(400).send({ error: 'Datos de inicio de sesión inválidos' });
    }

    const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET);
    res.send({ usuario, token });
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).send({ error: 'Error interno del servidor al iniciar sesión.' });
  }
};  