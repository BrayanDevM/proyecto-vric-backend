'use strict';
const Config = require('../models/app-version.model');

const controller = {
  consultarAppVersion: (req, res) => {
    Config.find({}).exec((error, appVersion) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al traer version de app',
          error,
        });
      }
      return res.status(200).json({
        ok: true,
        appVersion,
      });
    });
  },
  actualizarAppVersion: (req, res) => {
    var id = null;
    if (!req.params.id) {
      id = req.params.id;
    } else {
      id = req.body._id;
    }
    var body = req.body;
    Config.findById(id).exec((error, appVersion) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar version de app',
          error,
        });
      }
      if (!appVersion) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El registro de versiones no existe',
        });
      }

      config.frontend_version = body.frontend_version;
      config.backend_version = body.backend_version;

      config.save((error, appVersionActualizada) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar registro de versiones',
            error,
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Registro de versiones actualizado correctamente',
          appVersionActualizada,
        });
      });
    });
  },
};

module.exports = controller;
