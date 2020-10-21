const express = require('express');
const ruta = express();
const madresController = require('../controllers/madres.controller');
const authMiddleware = require('../middlewares/auth.middleware');

ruta.get('/madres', madresController.traerMadres);
// ruta.get(
//   '/madres/:id',
//   madresController.obtenerResponsable
// );
// ruta.post(
//   '/respBeneficiarios',
//   authMiddleware.verificarToken,
//   madresController.crearRespBeneficiario
// );
ruta.put(
  '/madres/:id',
  // authMiddleware.verificarToken,
  madresController.actualizarMadre
);
ruta.delete(
  '/madres/:id',
  // authMiddleware.verificarToken,
  madresController.eliminarMadre
);

module.exports = ruta;
