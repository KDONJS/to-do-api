require('dotenv').config();
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
  try {
    // Crear un nuevo usuario con el modelo Usuario
    const usuario = new Usuario(req.body);

    // Hashear la contraseña antes de guardar el usuario
    usuario.password = await bcrypt.hash(usuario.password, 8);
    
    // Guardar el usuario en la base de datos
    await usuario.save();

    // Llamar al método generateAuthToken para generar el token y guardarlo en la base de datos
    const token = await usuario.generateAuthToken();

    // Enviar el perfil del usuario y el token como respuesta
    // Asegúrate de no enviar la contraseña en la respuesta
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.password;
    res.status(201).send({ usuario: usuarioSinPassword, token });
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
    if (!isMatch) {
      return res.status(400).send({ error: 'Contraseña incorrecta.' });
    }

    const token = await usuario.generateAuthToken(); // Genera un nuevo token
    res.send({ usuario, token, message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send({ error: 'Error al iniciar sesión.' });
  }
};