var express = require('express');
var ruta = express();
var udsController = require('../controllers/uds.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get('/uds', authMiddleware.verificarToken, udsController.obtenerUds);
ruta.get(
  '/uds/datos',
  authMiddleware.verificarToken,
  udsController.obtenerDatosUds
);
ruta.get(
  '/uds/unidad/:id',
  authMiddleware.verificarToken,
  udsController.obtenerUnidad
);
ruta.get(
  '/uds/disponibles/:contratoId',
  // authMiddleware.verificarToken,
  udsController.obtenerUdsDisponiblesPorContrato
);
ruta.get(
  '/uds/disponibles',
  // authMiddleware.verificarToken,
  udsController.obtenerUdsDisponibles
);
ruta.post(
  '/uds',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  udsController.crearUds
);
ruta.put(
  '/uds/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  udsController.actualizarUds
);
ruta.delete(
  '/uds/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  udsController.eliminarUds
);

module.exports = ruta;
