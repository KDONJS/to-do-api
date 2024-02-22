require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator'); // Añade este paquete para validaciones

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Elimina espacios al inicio y final
    lowercase: true, // Convierte a minúsculas
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Correo electrónico inválido');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7, // Longitud mínima para la contraseña
    trim: true, 
    validate(value) {
      if (value.toLowerCase().includes('password')) { // Validación básica de contraseña
        throw new Error('La contraseña no debe contener la palabra "password"');
      }
    }
  },
  numeroTelefono: {
    type: Number,
    required: true,
    validate(value) {
      // Considera usar una librería dedicada a validación de teléfonos
      if (value.toString().length < 9) {
        throw new Error('Número de teléfono inválido');
      }
    }   
  },
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now // Registra también la fecha de actualización
  },
  activo: {
    type: Boolean,
    default: false 
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

// Método para hashear la contraseña antes de guardar el usuario
usuarioSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Método para comparar contraseñas ingresadas con las hasheadas
usuarioSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

usuarioSchema.methods.generateAuthToken = async function() {
  const usuario = this;
  const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET, { expiresIn: '2h' });
  usuario.tokens = usuario.tokens.concat({ token });
  await usuario.save();
  return token;
};

// Ocultar información sensible
usuarioSchema.methods.toPublicJSON = function () {
  const usuario = this;
  const usuarioObject = usuario.toObject();

  delete usuarioObject.password;
  delete usuarioObject.tokens;
  delete usuarioObject.__v; 

  return usuarioObject;
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
