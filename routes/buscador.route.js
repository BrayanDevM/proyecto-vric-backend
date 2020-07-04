var express = require('express');
var ruta = express();
var buscadorController = require('../controllers/buscador.controller');
var authMiddleware = require('../middlewares/auth.middleware');

ruta.get(
  '/buscar/todos/:criterio',
  // authMiddleware.verifyToken,
  buscadorController.buscarTodos
);
ruta.get(
  '/buscar/coleccion/:nombreColeccion/:criterio',
  // authMiddleware.verifyToken,
  buscadorController.BuscarPorColeccion
);

module.exports = ruta;
