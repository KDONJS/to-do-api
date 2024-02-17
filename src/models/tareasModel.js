const mongoose = require('mongoose');

const subtareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  completada: {
    type: Boolean,
    default: false,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaActualizacion: {
    type: Date,
  },
});


const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  completada: {
    type: Boolean,
    default: false,
  },
  subtareas: [subtareaSchema], // Campo de subtareas como un arreglo de subdocumentos
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaActualizacion: {
    type: Date,
  },
});


const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;