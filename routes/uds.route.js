const express = require('express');
const ruta = express();
const udsController = require('../controllers/uds.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Devuelve UUDDSS sin info de beneficiarios
ruta.get('/uds', authMiddleware.verificarToken, udsController.traerUds);
// Devuelve UUDDSS con info de beneficiarios
ruta.get(
  '/uds/beneficiarios',
  authMiddleware.verificarToken,
  udsController.traerUds_beneficiarios
);
// Devuelve UUDDSS con info de beneficiarios y responsables
ruta.get(
  '/uds/beneficiarios/responsables',
  authMiddleware.verificarToken,
  udsController.traerUds_beneficiarios_responsables
);
// Devuelve UUDDSS con sólo código y nombre
ruta.get(
  '/uds/codigos',
  authMiddleware.verificarToken,
  udsController.traerUds_codigos
);
// Devuelve UDS sin info de beneficiarios
ruta.get('/uds/:id', authMiddleware.verificarToken, udsController.traerUnidad);
ruta.get(
  '/uds/:id/beneficiarios',
  authMiddleware.verificarToken,
  udsController.traerUnidad_beneficiarios
);
ruta.get(
  '/uds/:id/beneficiarios/responsables',
  authMiddleware.verificarToken,
  udsController.traerUnidad_beneficiarios_responsables
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
