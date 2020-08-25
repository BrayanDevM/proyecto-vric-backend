const express = require('express');
const ruta = express();
const contratosController = require('../controllers/contratos.controller');
const authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/contratos',
  [authMiddleware.verificarToken, authMiddleware.verificarSupervisorRol],
  contratosController.traerContratos
);
ruta.get(
  '/contratos/uds',
  [authMiddleware.verificarToken, authMiddleware.verificarSupervisorRol],
  contratosController.traerContratos_uds
);
ruta.get(
  '/contratos/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarSupervisorRol],
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
