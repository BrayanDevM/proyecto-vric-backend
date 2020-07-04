var express = require('express');
var ruta = express();
var usuariosController = require('../controllers/usuarios.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/usuarios',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.obtenerUsuarios
);
ruta.post(
  '/usuarios',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.crearUsuario
);
ruta.put(
  '/usuarios/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarMismoUsuario],
  usuariosController.actualizarUsuario
);
ruta.delete(
  '/usuarios/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.eliminarUsuario
);

module.exports = ruta;
