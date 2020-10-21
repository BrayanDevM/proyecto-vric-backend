'use strict';
const Madres = require('../models/madres-beneficiarios.model');

const controller = {
  traerMadres: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const tipoDoc = req.query.tipoDoc;
    const documento = req.query.documento;
    const nombre1 = req.query.nombre1;
    const nombre2 = req.query.nombre2;
    const apellido1 = req.query.apellido1;
    const apellido2 = req.query.apellido2;
    const nacimiento = req.query.nacimiento;
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let criterioBusqueda = new Object();

    if (tipoDoc !== undefined) {
      criterioBusqueda.tipoDoc = tipoDoc;
    }
    if (documento !== undefined) {
      criterioBusqueda.documento = documento;
    }
    if (nombre1 !== undefined) {
      criterioBusqueda.nombre1 = nombre1;
    }
    if (nombre2 !== undefined) {
      criterioBusqueda.nombre2 = nombre2;
    }
    if (apellido1 !== undefined) {
      criterioBusqueda.apellido1 = apellido1;
    }
    if (apellido2 !== undefined) {
      criterioBusqueda.apellido2 = apellido2;
    }
    if (nacimiento !== undefined) {
      criterioBusqueda.nacimiento = nacimiento;
    }

    Madres.find(criterioBusqueda)
      .skip(desde)
      .limit(limite)
      .sort('nombre1')
      .exec((error, madres) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al traer madres',
            error
          });
        }
        Madres.countDocuments({}, (error, registros) => {
          return res.status(200).json({
            ok: true,
            madres,
            registros
          });
        });
      });
  },
  actualizarMadre: (req, res) => {
    var id = null;
    if (!req.params.id) {
      id = req.params.id;
    } else {
      id = req.body._id;
    }
    var body = req.body;
    Madres.findById(id).exec((error, madre) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar madre',
          error
        });
      }
      if (!madre) {
        return res.status(400).json({
          ok: false,
          mensaje: 'la madre no existe'
        });
      }

      madre.tipoDoc = body.tipoDoc;
      madre.documento = body.documento;
      madre.nombre1 = body.nombre1;
      madre.nombre2 = body.nombre2;
      madre.apellido1 = body.apellido1;
      madre.apellido2 = body.apellido2;
      madre.nacimiento = body.nacimiento;
      madre.sexo = body.sexo;

      madre.save((error, madreActualizada) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar madre',
            error
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Madre actualizada correctamente',
          madreActualizada
        });
      });
    });
  },
  eliminarMadre: (req, res) => {
    var id = req.params.id;
    Madres.findByIdAndDelete(id, (error, madreEliminada) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al eliminar madre',
          error
        });
      }
      if (!madreEliminada) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La madre no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Madre eliminada correctamente',
        madreEliminada
      });
    });
  }
};

module.exports = controller;
