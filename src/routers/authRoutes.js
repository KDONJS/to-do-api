const express = require('express');
const router = express.Router();
const { 
    registrarUsuario, 
    iniciarSesionUsuario, 
    cerrarSesion, 
    editarUsuario, 
    eliminarUsuario
} = require('../controllers/authController');
const multer = require('multer');
const auth = require('../middlewares/auth');
const upload = multer({storage: multer.memoryStorage() });
const { uploadFile } = require('../middlewares/uploadMiddleware')

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: username
 *         type: string
 *         required: true
 *         description: El nombre de usuario para el registro
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *         description: La contraseña para el registro (longitud mínima 7)
 *       - in: formData
 *         name: imagenUrl
 *         type: file
 *         description: La imagen de perfil del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error de servidor
 */

router.post('/registro', upload.single('imagenUrl'), uploadFile ,registrarUsuario);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario y devuelve un token de autenticación.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               required: true
 *               description: La dirección de correo electrónico del usuario.
 *             password:
 *               type: string
 *               required: true
 *               description: La contraseña del usuario.
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación JWT
 *       401:
 *         description: Credenciales inválidas o error de autenticación.
 *       500:
 *         description: Error interno del servidor.
 */

router.post('/login', iniciarSesionUsuario);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra sesión de un usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description:  Sesión cerrada exitosamente
 *       401: 
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */

router.post('/logout', auth, cerrarSesion);

/**
 * @swagger
 * /api/auth/me:
 *   patch:
 *     summary: Edita la información del usuario autenticado.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: La nueva dirección de correo electrónico del usuario.
 *             numeroTelefono:
 *               type: number
 *               description: El nuevo número de teléfono del usuario.
 *             nombres:
 *               type: string
 *               description: Los nuevos nombres del usuario.
 *             apellidos:
 *               type: string
 *               description: Los nuevos apellidos del usuario.
 *             fechaNacimiento:
 *               type: string
 *               description: La nueva fecha de nacimiento del usuario.
 *             password:
 *               type: string
 *               description: La nueva contraseña del usuario.
 *             imagenUrl:
 *               type: file
 *               description: La nueva imagen de perfil del usuario.
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error de validación o actualización.
 *       401:
 *         description: Token inválido o no proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */

router.patch('/me', auth, upload.single('imagenUrl'), editarUsuario);

/**
 * @swagger
 * /api/auth/me:
 *   delete:
 *     summary: Elimina la cuenta del usuario autenticado.
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente.
 *       401:
 *         description: Token inválido o no proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */

router.delete('/me', auth, eliminarUsuario);

module.exports = router;