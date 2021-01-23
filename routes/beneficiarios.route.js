const express = require('express');
const ruta = express();
const beneficiariosController = require('../controllers/beneficiarios.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Peticiones GET de beneficiarios
ruta.get(
  '/beneficiarios',
  authMiddleware.verificarToken,
  beneficiariosController.traerBeneficiarios
);
ruta.get(
  '/beneficiarios/responsables',
  authMiddleware.verificarToken,
  beneficiariosController.traerBeneficiarios_responsables
);

// Peticiones GET de un beneficiario
ruta.get(
  '/beneficiarios/:id',
  authMiddleware.verificarToken,
  beneficiariosController.traerBeneficiario
);
ruta.get(
  '/beneficiarios/:id/responsables',
  authMiddleware.verificarToken,
  beneficiariosController.traerBeneficiario_responsables
);

// Peticiones POST, PUT, DELETE
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
ruta.put(
  '/beneficiarios',
  authMiddleware.verificarToken,
  beneficiariosController.actualizarTodosLosBeneficiarios
);
ruta.delete(
  '/beneficiarios/:id',
  authMiddleware.verificarToken,
  beneficiariosController.eliminarBeneficiario
);

module.exports = ruta;
