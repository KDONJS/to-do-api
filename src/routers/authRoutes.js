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

router.post('/registro', upload.single('imagenUrl'), uploadFile ,registrarUsuario);
router.post('/login', iniciarSesionUsuario);
router.post('/logout', auth, cerrarSesion);
router.patch('/me', auth, editarUsuario); 
router.delete('/me', auth, eliminarUsuario);

module.exports = router;