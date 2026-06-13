const express = require('express');
const router = express.Router();
const controladorEscaneo = require('../controllers/escaneo.controller');

//cuando llegue un POST a /escanear, lo derivamos al controlador

router.post('/escanear', controladorEscaneo.iniciarEscaneo);

module.exports = router;


