var express = require('express');
var ruta = express();
var contratosController = require('../controllers/contratos.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/contratos',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  contratosController.obtenerContratos
);
ruta.get(
  '/contratos/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  contratosController.obtenerContrato
);
ruta.post(
  '/contratos',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  contratosController.crearContrato
);
ruta.put(
  '/contratos/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  contratosController.actualizarContrato
);
ruta.delete(
  '/contratos/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  contratosController.eliminarContrato
);

module.exports = ruta;
