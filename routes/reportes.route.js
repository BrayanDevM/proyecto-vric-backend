var express = require('express');
var ruta = express();
var reportesController = require('../controllers/reportes.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/reportes',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  reportesController.obtenerReportes
);
// ruta.get(
//   '/contrato/:id',
//   [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
//   reportesController.obtenerContrato
// );
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
// ruta.delete(
//   '/reporte/:id',
//   [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
//   reportesController.eliminarContrato
// );

module.exports = ruta;
