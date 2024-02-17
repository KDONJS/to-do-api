const Tarea = require('../models/tareasModel');

exports.listarTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({});
    res.status(200).send(tareas);
  } catch (error) {
    res.status(500).send(error);
  }
};
  
  exports.crearTarea = async (req, res) => {
    try {
      const nuevaTarea = new Tarea(req.body);
      await nuevaTarea.save();
      res.status(201).send(nuevaTarea);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  exports.crearSubtarea = async (req, res) => {
    try {

      const tarea = await Tarea.findById(req.params.id);
      if (!tarea) {
        return res.status(404).send({ error: 'Tarea no encontrada.' });
      }
  
      tarea.subtareas.push(req.body);
  
      await tarea.save();
      res.status(201).send(tarea);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.actualizarTarea = async (req, res) => {
    try {
      const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true 
      });
  
      if (!tareaActualizada) {
        return res.status(404).send();
      }
  
      res.send(tareaActualizada);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  exports.actualizarSubtarea = async (req, res) => {
    try {
      const tarea = await Tarea.findById(req.params.id);
      if (!tarea) {
        return res.status(404).send({ error: 'Tarea no encontrada.' });
      }
  
      const subtarea = tarea.subtareas.id(req.body._id); 
      if (!subtarea) {
        return res.status(404).send({ error: 'Subtarea no encontrada.' });
      }
  
      subtarea.titulo = req.body.titulo || subtarea.titulo;
      subtarea.completada = req.body.completada !== undefined ? req.body.completada : subtarea.completada;
  
      await tarea.save(); 
      res.send(tarea);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.eliminarTarea = async (req, res) => {
    try {
      const tarea = await Tarea.findByIdAndDelete(req.params.id);
      if (!tarea) {
        return res.status(404).send({ error: "Tarea no encontrada." });
      }
      res.send({ message: "Tarea eliminada con éxito." });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  exports.eliminarSubtarea = async (req, res) => {
    const { id, subtareaId } = req.params;
  
    try {
      const tarea = await Tarea.findById(id);
      if (!tarea) {
        return res.status(404).send({ error: "Tarea no encontrada." });
      }

      const indiceSubtarea = tarea.subtareas.findIndex(subtarea => subtarea._id.toString() === subtareaId);
  
      if (indiceSubtarea === -1) {
        return res.status(404).send({ error: "Subtarea no encontrada." });
      }
  
      tarea.subtareas.splice(indiceSubtarea, 1);
  
      await tarea.save();
      res.send({ message: "Subtarea eliminada exitosamente." });
    } catch (error) {
      console.error(error); // Imprime el error para depuración
      res.status(500).send({ error: "Error del servidor" });
    }
  };
  