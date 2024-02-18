require('dotenv').config();
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registrarUsuario = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);

    await usuario.save();

    const token = await usuario.generateAuthToken();
    res.status(201).send({ usuario: { ...usuario.toObject(), password: undefined }, token });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send({ error: 'Error interno del servidor al registrar usuario.' });
  }
};

exports.editarUsuario = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'numeroTelefono', 'nombres', 'apellidos', 'fechaNacimiento', 'password']; // Añade aquí los campos permitidos para actualizar
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Actualizaciones inválidas!' });
    }

    updates.forEach((update) => req.usuario[update] = req.body[update]);
    if (req.body.password) {
      req.usuario.password = await bcrypt.hash(req.body.password, 8);
    }

    await req.usuario.save();
    res.send(req.usuario);
  } catch (error) {
    console.error('Error al editar el usuario:', error);
    res.status(500).send({ error: 'Error al editar el usuario.' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    await req.usuario.remove();
    res.send({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send({ error: 'Error al eliminar el usuario.' });
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

    const token = await usuario.generateAuthToken();
    res.send({ usuario: { ...usuario.toObject(), password: undefined }, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send({ error: 'Error al iniciar sesión.' });
  }
};

exports.cerrarSesion = async (req, res) => {
  try {
    req.usuario.tokens = req.usuario.tokens.filter((tokenObj) => {
      return tokenObj.token !== req.token;
    });
    await req.usuario.save();
    res.send({ message: 'Sesión cerrada con éxito.' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).send({ error: 'Error al cerrar sesión.' });
  }
};

