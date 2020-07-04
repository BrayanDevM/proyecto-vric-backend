var express = require('express');
var ruta = express();
var beneficiariosController = require('../controllers/beneficiarios.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/beneficiarios',
  authMiddleware.verificarToken,
  beneficiariosController.obtenerBeneficiarios
);
ruta.get(
  '/beneficiarios/:id',
  authMiddleware.verificarToken,
  beneficiariosController.obtenerBeneficiario
);
ruta.post(
  '/beneficiarios',
  authMiddleware.verificarToken,
  beneficiariosController.crearBeneficiario
);
ruta.put(
  '/beneficiarios/:id',
  authMiddleware.verificarToken,
  beneficiariosController.actualizarBeneficiario
);
ruta.delete(
  '/beneficiarios/:id',
  authMiddleware.verificarToken,
  beneficiariosController.eliminarBeneficiario
);

module.exports = ruta;
