const express = require('express');
const ruta = express();
const configController = require('../controllers/app-version.controller');
const authMiddleware = require('../middlewares/auth.middleware');

ruta.get('/version', configController.consultarAppVersion);
ruta.post(
  '/version',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  configController.actualizarAppVersion
);

module.exports = ruta;
