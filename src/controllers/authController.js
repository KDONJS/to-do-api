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

    // Crear un token para el nuevo usuario
    const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET);

    // Enviar el perfil del usuario y el token como respuesta
    res.status(201).send({ usuario, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.iniciarSesionUsuario = async (req, res) => {
  try {
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) {
      console.log('Usuario no encontrado con el email:', req.body.email);
      return res.status(400).send({ error: 'Datos de inicio de sesión inválidos' });
    }

    console.log('Password de la petición:', req.body.password);
    console.log('Hash de la contraseña en la base de datos:', usuario.password);

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(req.body.password, usuario.password);
    if (!isMatch) {
      console.log('Contraseña incorrecta para el usuario:', req.body.email);
      return res.status(400).send({ error: 'Datos de inicio de sesión inválidos' });
    }

    // Crear un token para el usuario existente
    const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET);

    // Enviar el perfil del usuario y el token como respuesta
    res.send({ usuario, token });
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).send(error);
  }
};

  