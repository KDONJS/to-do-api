const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  numeroTelefono: {
    type: Number,
    required: true,
  },
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaActualizacion: {
    type: Date,
  },
  activo: {
    type: Boolean,
    default: false,
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
  const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET);

  usuario.tokens = usuario.tokens.concat({ token });
  await usuario.save();

  return token;
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
