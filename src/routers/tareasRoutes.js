const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const tareasController = require('../controllers/tareasController')

router.get('/', auth, tareasController.listarTareas);
router.post('/', auth,tareasController.crearTarea);
router.post('/:id/subtareas', auth, tareasController.crearSubtarea);
router.put('/:id', auth, tareasController.actualizarTarea);
router.put('/:id/subtareas', auth, tareasController.actualizarSubtarea);
router.delete('/:id', auth, tareasController.eliminarTarea);
router.delete('/:id/subtareas/:subtareaId', auth, tareasController.eliminarSubtarea);

module.exports = router;