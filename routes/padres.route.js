const express = require('express');
const ruta = express();
const padresController = require('../controllers/padres.controller');
const authMiddleware = require('../middlewares/auth.middleware');

ruta.get('/padres', padresController.traerPadres);
// ruta.get(
//   '/padres/:id',
//   padresController.obtenerResponsable
// );
// ruta.post(
//   '/padres',
//   authMiddleware.verificarToken,
//   padresController.crearRespBeneficiario
// );
ruta.put(
  '/padres/:id',
  // authMiddleware.verificarToken,
  padresController.actualizarPadre
);
ruta.delete(
  '/padres/:id',
  // authMiddleware.verificarToken,
  padresController.eliminarPadre
);

module.exports = ruta;
