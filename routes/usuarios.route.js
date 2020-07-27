const express = require('express');
const ruta = express();
const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Peticiones GET de usuarios
ruta.get(
  '/usuarios',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.traerUsuarios
);
ruta.get(
  '/usuarios/uds',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.traerUsuarios_uds
);
ruta.get(
  '/usuarios/contratos',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.traerUsuarios_contratos
);
ruta.get(
  '/usuarios/contratos/uds',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.traerUsuarios_uds_contratos
);
ruta.get(
  '/usuarios/uds/contratos',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.traerUsuarios_uds_contratos
);

// Peticiones GET de usuario
ruta.get(
  '/usuarios/:id',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  usuariosController.obtenerUsuario
);

// Peticiones POST, PUT, DELETE de usuarios
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
