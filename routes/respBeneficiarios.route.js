const express = require('express');
const ruta = express();
const respBeneficiariosController = require('../controllers/respBeneficiarios.controller');
const authMiddleware = require('../middlewares/auth.middleware');

ruta.get('/respBeneficiarios', respBeneficiariosController.obtenerResponsables);
ruta.get(
  '/respBeneficiarios/:id',
  authMiddleware.verificarToken,
  respBeneficiariosController.obtenerResponsable
);
ruta.post(
  '/respBeneficiarios',
  authMiddleware.verificarToken,
  respBeneficiariosController.crearRespBeneficiario
);
ruta.put(
  '/respBeneficiarios/:id',
  authMiddleware.verificarToken,
  respBeneficiariosController.actualizarRespBeneficiario
);
ruta.delete(
  '/respBeneficiarios/:id',
  authMiddleware.verificarToken,
  respBeneficiariosController.eliminarRespBeneficiario
);

module.exports = ruta;
