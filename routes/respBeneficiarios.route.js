var express = require('express');
var ruta = express();
var respBeneficiariosController = require('../controllers/respBeneficiarios.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get('/respBeneficiarios', respBeneficiariosController.obtenerResponsables);
ruta.get(
  '/respBeneficiarios/:id',
  authMiddleware.verificarToken,
  respBeneficiariosController.obtenerResponsable
);
ruta.get(
  '/respBeneficiarios/documento/:documento',
  // authMiddleware.verificarToken,
  respBeneficiariosController.buscarResponsablePorDoc
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
