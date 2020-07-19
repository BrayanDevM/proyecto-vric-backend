'use strict';
var Contratos = require('../models/contratos.model');
var Uds = require('../models/uds.model');

var controller = {
  obtenerContratos: (req, res) => {
    var desde = req.query.desde || 0; // Variable para realizar paginación (desde)
    desde = Number(desde);
    if (isNaN(desde)) {
      desde = 0;
    }

    Contratos.find({})
      .skip(desde)
      // .limit(5)
      .exec((error, contratos) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al traer contratos',
            error
          });
        }
        Contratos.countDocuments({}, (error, registros) => {
          return res.status(200).json({
            ok: true,
            contratos,
            registros
          });
        });
      });
  },
  obtenerContrato: (req, res) => {
    var contratoId = req.params.id;
    Contratos.findById(contratoId)
      .populate('uds')
      .populate('creadoPor')
      .exec((error, contrato) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar contrato',
            error
          });
        }
        if (!contrato) {
          return res.status(400).json({
            ok: false,
            mensaje: 'El contrato no existe'
          });
        }
        res.status(200).json({
          ok: true,
          contrato
        });
      });
  },
  crearContrato: (req, res) => {
    var body = req.body;
    var contrato = new Contratos({
      codigo: body.codigo,
      regional: body.regional,
      cz: body.cz,
      cupos: body.cupos,
      eas: body.eas,
      nit: body.nit,
      activo: body.activo,
      creadoPor: req.solicitadoPor,
      creadoEl: body.creadoEl,
      uds: body.uds
    });

    contrato.save((error, contratoCreado) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al crear contrato',
          error
        });
      }
      asginarContratoUds(contratoCreado._id, body.uds);
      return res.status(201).json({
        ok: true,
        contratoCreado
      });
    });
  },
  actualizarContrato: (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var udsEnContrato = [];
    Contratos.findById(id).exec((error, contrato) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar contrato',
          error
        });
      }
      if (!contrato) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El contrato no existe'
        });
      }
      udsEnContrato = contrato.uds;
      contrato.codigo = body.codigo;
      contrato.regional = body.regional;
      contrato.cz = body.cz;
      contrato.cupos = body.cupos;
      contrato.eas = body.eas;
      contrato.nit = body.nit;
      contrato.uds = body.uds;
      contrato.activo = body.activo;
      contrato.save((error, contratoActualizado) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar contrato',
            error
          });
        }
        asginarContratoUds(id, body.uds, udsEnContrato);
        return res.status(200).json({
          ok: true,
          mensaje: 'Contrato actualizado correctamente',
          contratoActualizado
        });
      });
    });
  },
  eliminarContrato: (req, res) => {
    var id = req.params.id;
    Contratos.findByIdAndDelete(id, (error, contratoEliminado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al eliminar contrato',
          error
        });
      }
      if (!contratoEliminado) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El contrato no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Contrato eliminado correctamente',
        contratoEliminado
      });
    });
  }
};

function asginarContratoUds(contratoId, udsIds, contratoUds = []) {
  // Cuando actualizao contratos busco UDS eliminadas
  let udsEliminadas = [];
  udsEliminadas = buscarUdsEliminadas(contratoUds, udsIds);
  // Si hay a eliminar, busco uds y elimino contrato asignado
  if (udsEliminadas.length > 0) {
    udsEliminadas.forEach(unidadId => {
      Uds.findById(unidadId, (error, unidad) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar UDS',
            error
          });
        }
        if (!unidad) {
          return res.status(400).json({
            ok: false,
            mensaje: 'La UDS no existe'
          });
        }
        unidad.enContrato = null;
        unidad.save((error, unidadActualizada) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al asignar contrato a UDS',
              error
            });
          }
          return true;
        });
      });
    });
  }
  // asigno id de contrato a UDS
  udsIds.forEach(id => {
    Uds.findById(id, (error, unidad) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar UDS',
          error
        });
      }
      if (!unidad) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La UDS no existe'
        });
      }
      unidad.enContrato = contratoId;
      unidad.save((error, unidadActualizada) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al asignar contrato a UDS',
            error
          });
        }
        return true;
      });
    });
  });
}

function buscarUdsEliminadas() {
  var args = Array.prototype.slice.call(arguments),
    arr = args.shift().splice(0);
  // console.log('UDS en contrato', arr);
  // console.log('UDS enviadas', args[0]);
  args.forEach(function(arrN) {
    arrN.forEach(function(objN) {
      for (var i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) === JSON.stringify(objN)) {
          arr.splice(i, 1);
          break;
        }
      }
    });
  });
  /**
   * Comparo arreglo con las UDS actualizadas en contrato -vs-
   * las UDS que había en contrato y devuelvo arreglo con UDS
   * que fueron eliminadas
   */
  // console.log('UDS eliminadas de contrato: ', arr);
  return arr;
}

module.exports = controller;
