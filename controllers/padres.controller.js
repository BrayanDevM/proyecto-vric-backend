'use strict';
const Padres = require('../models/padres-beneficiarios.model');

const controller = {
  traerPadres: (req, res) => {
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

    Padres.find(criterioBusqueda)
      .skip(desde)
      .limit(limite)
      .sort('nombre1')
      .exec((error, padres) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al traer padres',
            error
          });
        }
        Padres.countDocuments({}, (error, registros) => {
          return res.status(200).json({
            ok: true,
            padres,
            registros
          });
        });
      });
  },
  actualizarPadre: (req, res) => {
    var id = null;
    if (!req.params.id) {
      id = req.params.id;
    } else {
      id = req.body._id;
    }
    var body = req.body;
    Padres.findById(id).exec((error, padre) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar padre',
          error
        });
      }
      if (!padre) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El padre no existe'
        });
      }

      padre.tipoDoc = body.tipoDoc;
      padre.documento = body.documento;
      padre.nombre1 = body.nombre1;
      padre.nombre2 = body.nombre2;
      padre.apellido1 = body.apellido1;
      padre.apellido2 = body.apellido2;
      padre.nacimiento = body.nacimiento;
      padre.sexo = body.sexo;

      padre.save((error, padreActualizado) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar padre',
            error
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Padre actualizado correctamente',
          padreActualizado
        });
      });
    });
  },
  eliminarPadre: (req, res) => {
    var id = req.params.id;
    Padres.findByIdAndDelete(id, (error, padreEliminado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al eliminar padre',
          error
        });
      }
      if (!padreEliminado) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El padre no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Padre eliminado correctamente',
        padreEliminado
      });
    });
  }
};

module.exports = controller;
