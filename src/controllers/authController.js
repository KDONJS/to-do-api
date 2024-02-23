require('dotenv').config();
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { bucket } = require('../db/firebase');

// Funciones auxiliares (Considera añadirlas a tu modelo de usuario)
const generarJWT = async (usuario) => {
  const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Puedes personalizar la duración del token 
  });

  usuario.tokens = usuario.tokens.concat({ token });
  await usuario.save();

  return token;
};

exports.registrarUsuario = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.body.activo) {
      req.body.activo = req.body.activo === 'true';
    }

    if (req.file) {
      const fileName = `perfil_${Date.now()}`;
      const fileUpload = bucket.file(fileName);
    
      await new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
    
        blobStream.on('error', (error) => reject(error));
    
        blobStream.on('finish', async () => {
          // Asegúrate de que esta línea coincida con el nombre del campo en tu modelo
          imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
          resolve(imageUrl); // Esto correctamente resuelve la URL de la imagen
        });
    
        blobStream.end(req.file.buffer);
      });
    }

    const usuarioData = req.body;

    if (imageUrl) {
      usuarioData.imagenUrl = imageUrl; // Asegúrate de que el campo se llame 'imagenUrl' en tu modelo y aquí
    }

    const usuario = new Usuario(usuarioData);

    await usuario.save();

    const token = await usuario.generateAuthToken(); 

    res.status(201).send({ usuario: usuario.toPublicJSON(), token });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send({ error: 'Error interno del servidor al registrar usuario.' });
  }
};

// Editar Usuario
exports.editarUsuario = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'numeroTelefono', 'nombres', 'apellidos', 'fechaNacimiento', 'password', 'imagenUrl', 'descripcion'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Actualizaciones inválidas!' });
    }

    // Procesar la carga de la nueva imagen si se proporciona una
    if (req.file) {
      const fileName = `perfil_${req.usuario._id}_${Date.now()}`;
      const fileUpload = bucket.file(fileName);

      await new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        blobStream.on('error', (error) => reject(error));

        blobStream.on('finish', async () => {
          // Actualizar la URL de la imagen en el perfil del usuario
          req.usuario.imagenUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
          resolve();
        });

        blobStream.end(req.file.buffer);
      });
    }

    // Actualizar otros campos
    updates.forEach((update) => {
      if(update !== 'imagenUrl') {
        req.usuario[update] = req.body[update];
      }
    });
    if (req.body.password) {
      req.usuario.password = await bcrypt.hash(req.body.password, 8);
    }

    await req.usuario.save();

    // Devolver el usuario actualizado ocultando la contraseña y otros datos sensibles
    res.send(req.usuario.toPublicJSON());
  } catch (error) {
    console.error('Error al editar el usuario:', error);
    res.status(500).send({ error: 'Error al editar el usuario.' });
  }
};

// Eliminar Usuario 
exports.eliminarUsuario = async (req, res) => {
  try {
    await req.usuario.remove();
    res.send({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send({ error: 'Error al eliminar el usuario.' });
  }
};

// Iniciar Sesión
exports.iniciarSesionUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) {
      return res.status(404).send({ error: 'Usuario no encontrado.' }); // Mejor usar status 404
    }

    const isMatch = await bcrypt.compare(req.body.password, usuario.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Credenciales incorrectas.' }); // Mejor usar status 401
    }

    const token = await generarJWT(usuario);
    res.send({ usuario: usuario.toPublicJSON(), token });
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

