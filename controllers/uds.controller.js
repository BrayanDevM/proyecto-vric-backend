'use strict';
var Uds = require('../models/uds.model');
var Usuarios = require('../models/usuarios.model');

var controller = {
  obtenerUds: (req, res) => {
    var desde = req.query.desde || 0; // Variable para realizar paginación (desde)
    desde = Number(desde);
    if (isNaN(desde)) {
      desde = 0;
    }

    Uds.find({})
      .skip(desde)
      .limit(50)
      .populate('beneficiarios')
      .populate('enContrato')
      .populate({
        path: 'beneficiarios',
        populate: [
          { path: 'creadoPor', select: 'nombre correo' },
          { path: 'responsableId' }
        ]
      })
      .exec((error, uds) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al traer UDS',
            error
          });
        }
        Uds.countDocuments({}, (error, registros) => {
          return res.status(200).json({
            ok: true,
            uds,
            registros
          });
        });
      });
  },
  obtenerUnidad: (req, res) => {
    var unidadId = req.params.id;
    Uds.findById(unidadId)
      .populate('beneficiarios')
      .populate('docentes', 'nombre correo documento')
      .populate('coordinador', 'nombre correo documento')
      .populate('gestor', 'nombre correo documento')
      .populate('creadoPor', 'nombre correo documento')
      .populate({
        path: 'beneficiarios',
        populate: [
          { path: 'creadoPor', select: 'nombre correo' },
          { path: 'responsableId' }
        ]
      })
      .populate('enContrato')
      .exec((error, unidad) => {
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
        res.status(200).json({
          ok: true,
          unidad
        });
      });
  },
  crearUds: (req, res) => {
    var body = req.body;
    var uds = new Uds({
      codigo: body.codigo,
      nombre: body.nombre,
      cupos: body.cupos,
      arriendo: body.arriendo,
      coordinador: body.coordinador,
      docentes: body.docentes,
      gestor: body.gestor,
      ubicacion: body.ubicacion,
      enContrato: body.enContrato,
      creadoPor: req.solicitadoPor,
      creadoEl: body.creadoEl,
      activa: body.activa
    });

    uds.save((error, udsCreada) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al crear contrato',
          error
        });
      }
      return res.status(201).json({
        ok: true,
        udsCreada
      });
    });
  },
  actualizarUds: (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Uds.findById(id).exec((error, uds) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar UDS',
          error
        });
      }
      if (!uds) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La UDS no existe'
        });
      }
      uds.arriendo = body.arriendo;
      uds.codigo = body.codigo;
      uds.nombre = body.nombre;
      uds.cupos = body.cupos;
      uds.coordinador = body.coordinador;
      uds.docentes = body.docentes;
      uds.gestor = body.gestor;
      uds.ubicacion = body.ubicacion;
      uds.activa = body.activa;
      uds.enContrato = body.enContrato;
      uds.save((error, udsActualizada) => {
        Promise.all([
          asignarUdsACoord(uds.coordinador, uds._id),
          asignarUdsAGestor(uds.gestor, uds._id),
          asignarUdsADocentes(uds.docentes, uds._id)
        ]).then(usuariosActualizados => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al actualizar UDS',
              error
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: 'UDS actualizada correctamente',
            udsActualizada,
            coordinadorActualizado: usuariosActualizados[0],
            GestorActualizado: usuariosActualizados[1],
            DocentesActualizadas: usuariosActualizados[2]
          });
        });
      });
    });
  },
  eliminarUds: (req, res) => {
    var id = req.params.id;
    Uds.findByIdAndDelete(id, (error, udsEliminada) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al eliminar UDS',
          error
        });
      }
      if (!udsEliminada) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La UDS no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'UDS eliminada correctamente',
        udsEliminada
      });
    });
  }
};

function asignarUdsACoord(coordinadorId, udsId) {
  return new Promise((resolve, reject) => {
    Usuarios.findById(coordinadorId, (error, coordinador) => {
      if (error) {
        console.log(error);
        reject({
          ok: false,
          mensaje: 'Error al buscar coordinador',
          error
        });
      }
      // Si la UDS no está asignada, la asigna, si ya la tiene no hace nada
      if (!coordinador.uds.includes(udsId)) {
        coordinador.uds.push(udsId);
        coordinador.save((error, coordinadorActualizado) => {
          if (error) {
            console.log(error);
            reject({
              ok: false,
              mensaje: 'Error al actualizar UDS en coordinador',
              error
            });
          }
          resolve(coordinadorActualizado);
        });
      } else {
        resolve('Coord. ya tenía asignada UDS');
      }
    });
  });
}

function asignarUdsAGestor(gestorId, udsId) {
  return new Promise((resolve, reject) => {
    Usuarios.findById(gestorId, (error, gestor) => {
      if (error) {
        reject({
          ok: false,
          mensaje: 'Error al buscar gestor',
          error
        });
      }
      if (!gestor.uds.includes(udsId)) {
        gestor.uds.push(udsId);
        gestor.save((error, gestorActualizado) => {
          if (error) {
            reject({
              ok: false,
              mensaje: 'Error al actualizar UDS en gestor',
              error
            });
          }
          resolve(gestorActualizado);
        });
      } else {
        resolve('Gestor ya tenía asignada esta UDS!');
      }
    });
  });
}

function asignarUdsADocentes(docentesIds, udsId) {
  return new Promise((resolve, reject) => {
    let docentesActualizadas = [];
    docentesIds.forEach(docenteId => {
      Usuarios.findById(docenteId, (error, docente) => {
        if (error) {
          reject({
            ok: false,
            mensaje: 'Error al buscar docente',
            error
          });
        }
        if (!docente.uds.includes(udsId)) {
          docente.uds.push(udsId);
          docente.save((error, docenteActualizado) => {
            if (error) {
              reject({
                ok: false,
                mensaje: 'Error al actualizar UDS en docente',
                error
              });
            }
            docentesActualizadas.push(docenteActualizado);
          });
        } else {
          docentesActualizadas.push(
            'Docente ' + docente.nombre + ' ya tenía asignada esta UDS'
          );
          // console.log('docentes act:', docentesActualizadas);
        }
      });
    });
    setTimeout(() => {
      resolve(docentesActualizadas);
    }, 300);
  });
}

module.exports = controller;