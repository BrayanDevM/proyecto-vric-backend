const express = require('express');
const ruta = express();
const authMiddleware = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

ruta.get(
  '/main-dashboard',
  authMiddleware.verificarToken,
  dashboardController.traerDatosDashboard
);

module.exports = ruta;
