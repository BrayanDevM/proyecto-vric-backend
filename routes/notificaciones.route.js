const express = require('express');
const ruta = express();
const Controller = require('../controllers/notificaciones.controller');
const authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/notificaciones',
  // authMiddleware.verificarToken,
  Controller.obtenerNotificaciones
);

module.exports = ruta;
