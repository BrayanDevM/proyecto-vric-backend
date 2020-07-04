'use strict';
var Reportes = require('../models//reportes.model');

var controller = {
  obtenerReportes: (req, res) => {
    Reportes.find({})
      .populate('reportadoPor', 'correo nombre telefono')
      .exec((error, reportes) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al traer reportes',
            error
          });
        }
        Reportes.countDocuments({}, (error, registros) => {
          return res.status(200).json({
            ok: true,
            reportes,
            registros
          });
        });
      });
  },
  crearReporte: (req, res) => {
    var body = req.body;
    var reporte = new Reportes({
      tipo: body.tipo,
      descripcion: body.descripcion,
      creadoEl: body.creadoEl,
      reportadoPor: req.solicitadoPor
    });

    reporte.save((error, reporteCreado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al crear reporte',
          error
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Reporte creado correctamente',
        reporteCreado
      });
    });
  },
  actualizarReporte: (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Reportes.findById(id, (error, reporte) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al encontrar reporte',
          error
        });
      }
      if (!reporte) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El reporte no existe'
        });
      }
      reporte.completado = body.completado;
      reporte.save((error, reporteActualizado) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar reporte',
            error
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Reporte actualizado correctamente',
          reporteActualizado
        });
      });
    });
  }
};

module.exports = controller;
