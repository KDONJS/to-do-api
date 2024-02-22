const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesionUsuario, cerrarSesion, editarUsuario, eliminarUsuario } = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesionUsuario);
router.post('/logout', auth, cerrarSesion);
router.patch('/me', auth, editarUsuario); 
router.delete('/me', auth, eliminarUsuario);

module.exports = router;