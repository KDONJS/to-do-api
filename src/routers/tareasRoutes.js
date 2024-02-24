const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const tareasController = require('../controllers/tareasController')

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: Lista todas las tareas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Error interno del servidor
 */

router.get('/', auth, tareasController.listarTareas);

/**
 * @swagger
 * /tareas:
 *   post:
 *     summary: Crea una nueva tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       201:
 *         description: Tarea creada correctamente.
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */

router.post('/', auth,tareasController.crearTarea);

router.post('/:id/subtareas', auth, tareasController.crearSubtarea);
router.put('/:id', auth, tareasController.actualizarTarea);
router.put('/:id/subtareas', auth, tareasController.actualizarSubtarea);
router.delete('/:id', auth, tareasController.eliminarTarea);
router.delete('/:id/subtareas/:subtareaId', auth, tareasController.eliminarSubtarea);

module.exports = router;