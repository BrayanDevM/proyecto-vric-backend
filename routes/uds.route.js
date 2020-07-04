var express = require('express');
var ruta = express();
var udsController = require('../controllers/uds.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get('/uds', authMiddleware.verificarToken, udsController.obtenerUds);
ruta.get(
  '/uds/unidad/:id',
  authMiddleware.verificarToken,
  udsController.obtenerUnidad
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
