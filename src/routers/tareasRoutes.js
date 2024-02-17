const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController')

router.get('/', tareasController.listarTareas);
router.post('/', tareasController.crearTarea);
router.post('/:id/subtareas', tareasController.crearSubtarea);
router.put('/:id', tareasController.actualizarTarea);
router.put('/:id/subtareas', tareasController.actualizarSubtarea);
router.delete('/:id', tareasController.eliminarTarea);
router.delete('/:id/subtareas/:subtareaId', tareasController.eliminarSubtarea);

module.exports = router;