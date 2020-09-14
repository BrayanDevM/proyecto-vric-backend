const express = require('express');
const ruta = express();
const Controller = require('../controllers/notificaciones.controller');

ruta.get('/notificaciones', Controller.obtenerNotificaciones);

module.exports = ruta;
