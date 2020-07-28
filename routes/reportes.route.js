const express = require('express');
const ruta = express();
const reportesController = require('../controllers/reportes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/reportes',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  reportesController.traerReportes
);
ruta.post(
  '/reportes',
  authMiddleware.verificarToken,
  reportesController.crearReporte
);
ruta.put(
  '/reportes/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  reportesController.actualizarReporte
);
ruta.delete(
  '/reporte/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  reportesController.eliminarReporte
);

module.exports = ruta;
