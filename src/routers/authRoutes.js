const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesionUsuario } = require('../controllers/authController');

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesionUsuario);

module.exports = router;
