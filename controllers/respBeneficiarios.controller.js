'use strict';
const RespBeneficiario = require('../models/respBeneficiarios.model');

const controller = {
  obtenerResponsables: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;

    RespBeneficiario.find({})
      .skip(desde)
      .limit(limite)
      .exec((error, respBeneficiarios) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al traer responsables de beneficiarios',
            error
          });
        }
        RespBeneficiario.countDocuments({}, (error, registros) => {
          return res.status(200).json({
            ok: true,
            respBeneficiarios,
            registros
          });
        });
      });
  },
  obtenerResponsable: (req, res) => {
    const id = req.params.id;
    RespBeneficiario.findById(id, (error, responsable) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar responsable',
          error
        });
      }
      if (!responsable) {
        return res.status(404).json({
          ok: false,
          mensaje: 'Responsable no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        responsable
      });
    });
  },
  crearRespBeneficiario: (req, res) => {
    var body = req.body;
    var responsableBeneficiario = new RespBeneficiario({
      tipoDoc: body.tipoDoc,
      documento: body.documento,
      nombre1: body.nombre1,
      nombre2: body.nombre2,
      apellido1: body.apellido1,
      apellido2: body.apellido2,
      nacimiento: body.nacimiento,
      sexo: body.sexo,
      paisNacimiento: body.paisNacimiento,
      dptoNacimiento: body.dptoNacimiento,
      municipioNacimiento: body.municipioNacimiento,
      creadoPor: body.creadoPor
    });

    responsableBeneficiario.save((error, responsableCreado) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al crear responsable de beneficiario',
          error
        });
      }
      return res.status(201).json({
        ok: true,
        responsableCreado
      });
    });
  },
  actualizarRespBeneficiario: (req, res) => {
    var id = req.params.id;
    var body = req.body;
    RespBeneficiario.findById(id).exec((error, respBeneficiario) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar responsable de beneficiario',
          error
        });
      }
      if (!respBeneficiario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'el responsable de beneficiario no existe'
        });
      }
      respBeneficiario.tipoDoc = body.tipoDoc;
      respBeneficiario.documento = body.documento;
      respBeneficiario.nombre1 = body.nombre1;
      respBeneficiario.nombre2 = body.nombre2;
      respBeneficiario.apellido1 = body.apellido1;
      respBeneficiario.apellido2 = body.apellido2;
      respBeneficiario.nacimiento = body.nacimiento;
      respBeneficiario.sexo = body.sexo;
      respBeneficiario.paisNacimiento = body.paisNacimiento;
      respBeneficiario.dptoNacimiento = body.dptoNacimiento;
      respBeneficiario.municipioNacimiento = body.municipioNacimiento;

      respBeneficiario.save((error, respBenActualizado) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar responsable de beneficiario',
            error
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Responsable de beneficiario actualizado correctamente',
          respBenActualizado
        });
      });
    });
  },
  eliminarRespBeneficiario: (req, res) => {
    var id = req.params.id;
    RespBeneficiario.findByIdAndDelete(id, (error, respBenEliminado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al eliminar responsable de beneficiario',
          error
        });
      }
      if (!respBenEliminado) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El responsable de beneficiario no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Responsable de beneficiario eliminado correctamente',
        respBenEliminado
      });
    });
  }
};

module.exports = controller;
