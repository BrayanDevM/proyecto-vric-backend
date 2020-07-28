'use strict';
const Reportes = require('../models//reportes.model');

const controller = {
  traerReportes: (req, res) => {
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
    let body = req.body;
    let reporte = new Reportes({
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
    let id = req.params.id;
    let body = req.body;
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
  },
  eliminarReporte: (req, res) => {
    const id = req.params.id;

    Reportes.findByIdAndDelete(id, (error, reporteEliminado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'No fue posible eliminar el reporte',
          error
        });
      }
      if (!reporteEliminado) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Este reporte no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Reporte eliminado correctamente',
        reporteEliminado
      });
    });
  }
};

module.exports = controller;
