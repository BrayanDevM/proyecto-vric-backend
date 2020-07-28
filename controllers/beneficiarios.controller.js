'use strict';
const Beneficiarios = require('../models/beneficiarios.model');
const RespBeneficiarios = require('../models/respBeneficiarios.model');
const Uds = require('../models/uds.model');

const controller = {
  traerBeneficiarios: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const estado = req.query.estado;
    const discapacidad = req.query.discapacidad;
    const criterio = req.query.criterio;
    const tipoDoc = req.query.tipoDoc;
    const paisNacimiento = req.query.paisNacimiento;
    const autorreconocimiento = req.query.autorreconocimiento;
    const uds = req.query.uds;
    const creadoPor = req.query.creadoPor;
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let filtro = [];

    // filtro por estado
    if (estado !== undefined) {
      filtro = retornarFiltro(estado, 'estado');
    }
    // filtro por discapacidad
    if (discapacidad !== undefined) {
      if (discapacidad === 'si') {
        filtro.push({ discapacidad: true });
      } else if (discapacidad === 'no') {
        filtro.push({ discapacidad: false });
      }
    }
    // filtro por criterio
    if (criterio !== undefined) {
      filtro = retornarFiltro(criterio, 'criterio');
    }
    // filtro por tipoDoc
    if (tipoDoc !== undefined) {
      filtro = retornarFiltro(tipoDoc, 'tipoDoc');
    }
    // filtro por paisNacimiento
    if (paisNacimiento !== undefined) {
      filtro = retornarFiltro(paisNacimiento, 'paisNacimiento');
    }
    // filtro por autorreconocimiento
    if (autorreconocimiento !== undefined) {
      filtro = retornarFiltro(autorreconocimiento, 'autorreconocimiento');
    }
    // filtro por uds
    if (uds !== undefined) {
      filtro = retornarFiltro(uds, 'uds');
    }
    // filtro por creadoPor
    if (creadoPor !== undefined) {
      filtro = retornarFiltro(creadoPor, 'creadoPor');
    }

    if (filtro.length === 0) {
      Beneficiarios.find({})
        .skip(desde)
        .limit(limite)
        .sort('nombre1')
        .populate('uds', 'nombre codigo')
        .populate('creadoPor', 'nombre correo telefono')
        .exec((error, beneficiarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer beneficiarios',
              error
            });
          }
          Beneficiarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              beneficiarios,
              registros
            });
          });
        });
    } else {
      Beneficiarios.find()
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .sort('nombre1')
        .populate('uds', 'nombre codigo')
        .populate('creadoPor', 'nombre correo telefono')
        .exec((error, beneficiarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer beneficiarios',
              error
            });
          }
          Beneficiarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              beneficiarios,
              registros
            });
          });
        });
    }
  },
  traerBeneficiarios_responsables: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const estado = req.query.estado;
    const discapacidad = req.query.discapacidad;
    const criterio = req.query.criterio;
    const tipoDoc = req.query.tipoDoc;
    const paisNacimiento = req.query.paisNacimiento;
    const autorreconocimiento = req.query.autorreconocimiento;
    const uds = req.query.uds;
    const creadoPor = req.query.creadoPor;
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let filtro = [];

    // filtro por estado
    if (estado !== undefined) {
      filtro = retornarFiltro(estado, 'estado');
    }
    // filtro por discapacidad
    if (discapacidad !== undefined) {
      if (discapacidad === 'si') {
        filtro.push({ discapacidad: true });
      } else if (discapacidad === 'no') {
        filtro.push({ discapacidad: false });
      }
    }
    // filtro por criterio
    if (criterio !== undefined) {
      filtro = retornarFiltro(criterio, 'criterio');
    }
    // filtro por tipoDoc
    if (tipoDoc !== undefined) {
      filtro = retornarFiltro(tipoDoc, 'tipoDoc');
    }
    // filtro por paisNacimiento
    if (paisNacimiento !== undefined) {
      filtro = retornarFiltro(paisNacimiento, 'paisNacimiento');
    }
    // filtro por autorreconocimiento
    if (autorreconocimiento !== undefined) {
      filtro = retornarFiltro(autorreconocimiento, 'autorreconocimiento');
    }
    // filtro por uds
    if (uds !== undefined) {
      filtro = retornarFiltro(uds, 'uds');
    }
    // filtro por creadoPor
    if (creadoPor !== undefined) {
      filtro = retornarFiltro(creadoPor, 'creadoPor');
    }

    if (filtro.length === 0) {
      Beneficiarios.find({})
        .skip(desde)
        .limit(limite)
        .sort('nombre1')
        .populate('uds', 'nombre codigo')
        .populate('creadoPor', 'nombre correo telefono')
        .populate('responsableId')
        .exec((error, beneficiarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer beneficiarios',
              error
            });
          }
          Beneficiarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              beneficiarios,
              registros
            });
          });
        });
    } else {
      Beneficiarios.find()
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .sort('nombre1')
        .populate('uds', 'nombre codigo')
        .populate('creadoPor', 'nombre correo telefono')
        .populate('responsableId')
        .exec((error, beneficiarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer beneficiarios',
              error
            });
          }
          Beneficiarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              beneficiarios,
              registros
            });
          });
        });
    }
  },
  traerBeneficiario: (req, res) => {
    var id = req.params.id;
    Beneficiarios.findById(id)
      .sort('nombre1')
      .populate('uds', 'nombre codigo')
      .populate('creadoPor', 'nombre correo telefono')
      .exec((error, beneficiario) => {
        if (error) {
          res.status(500).json({
            ok: false,
            mensaje: 'error al buscar beneficiario',
            error
          });
        }
        if (!beneficiario) {
          res.status(400).json({
            ok: false,
            mensaje: 'El beneficiario no existe'
          });
        }
        res.status(200).json({
          ok: true,
          beneficiario
        });
      });
  },
  traerBeneficiario_responsables: (req, res) => {
    var id = req.params.id;
    Beneficiarios.findById(id)
      .sort('nombre1')
      .populate('uds', 'nombre codigo')
      .populate('creadoPor', 'nombre correo telefono')
      .populate('responsableId')
      .exec((error, beneficiario) => {
        if (error) {
          res.status(500).json({
            ok: false,
            mensaje: 'error al buscar beneficiario',
            error
          });
        }
        if (!beneficiario) {
          res.status(400).json({
            ok: false,
            mensaje: 'El beneficiario no existe'
          });
        }
        res.status(200).json({
          ok: true,
          beneficiario
        });
      });
  },
  crearBeneficiario: (req, res) => {
    var body = req.body;
    var fecha = body.fecha;
    var respBen = {
      // Creo objeto con datos del responsable del beneficiario
      tipoDoc: body.respTipoDoc,
      documento: body.respDocumento,
      nombre1: body.respNombre1,
      nombre2: body.respNombre2,
      apellido1: body.respApellido1,
      apellido2: body.respApellido2,
      nacimiento: body.respNacimiento,
      sexo: body.respSexo,
      paisNacimiento: body.respPaisNacimiento,
      dptoNacimiento: body.respDptoNacimiento,
      municipioNacimiento: body.respMunicipioNacimiento,
      creadoPor: req.solicitadoPor._id,
      creadoEl: fecha
    };
    var beneficiario = {
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
      ingreso: body.ingreso,
      discapacidad: body.discapacidad,
      infoDiscapacidad: body.infoDiscapacidad,
      direccion: body.direccion,
      barrio: body.barrio,
      telefono: body.telefono,
      autorreconocimiento: body.autorreconocimiento,
      tipoResponsable: body.tipoResponsable,
      responsableId: null,
      criterio: body.criterio,
      infoCriterio: body.infoCriterio,
      comentario: body.comentario,
      uds: body.udsId,
      creadoPor: req.solicitadoPor._id,
      creadoEl: fecha
    };

    // Busco o creo el responsable
    crearResponsable(respBen)
      .then(responsable => {
        // Asigno el id del responsable al objeto beneficiario
        beneficiario.responsableId = responsable._id;
        // Lo creo
        crearBeneficiario(beneficiario)
          .then(beneficiario => {
            // Lo guardo en la UDS
            guardarBeneficiarioEnUds(beneficiario._id, beneficiario.uds)
              .then(guardado => {
                res.status(200).json({
                  ok: true,
                  mensaje: 'Beneficiario creado correctamente',
                  responsable,
                  beneficiario
                });
              })
              .catch(error => res.status(400).json(error));
          })
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  },
  actualizarBeneficiario: (req, res) => {
    var id = null;
    if (!req.params.id) {
      id = req.params.id;
    } else {
      id = req.body._id;
    }
    var body = req.body;
    Beneficiarios.findById(id).exec((error, beneficiario) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar beneficiario',
          error
        });
      }
      if (!beneficiario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'el beneficiario no existe'
        });
      }

      (beneficiario.tipoDoc = body.tipoDoc),
        (beneficiario.documento = body.documento),
        (beneficiario.nombre1 = body.nombre1),
        (beneficiario.nombre2 = body.nombre2),
        (beneficiario.apellido1 = body.apellido1),
        (beneficiario.apellido2 = body.apellido2),
        (beneficiario.nacimiento = body.nacimiento),
        (beneficiario.sexo = body.sexo),
        (beneficiario.paisNacimiento = body.paisNacimiento),
        (beneficiario.dptoNacimiento = body.dptoNacimiento),
        (beneficiario.municipioNacimiento = body.municipioNacimiento),
        (beneficiario.ingreso = body.ingreso),
        (beneficiario.discapacidad = body.discapacidad),
        (beneficiario.infoDiscapacidad = body.infoDiscapacidad),
        (beneficiario.direccion = body.direccion),
        (beneficiario.barrio = body.barrio),
        (beneficiario.telefono = body.telefono),
        (beneficiario.autorreconocimiento = body.autorreconocimiento),
        (beneficiario.tipoResponsable = body.tipoResponsable),
        (beneficiario.criterio = body.criterio),
        (beneficiario.infoCriterio = body.infoCriterio),
        (beneficiario.comentario = body.comentario),
        (beneficiario.uds = body.uds),
        (beneficiario.estado = body.estado),
        (beneficiario.egreso = body.egreso),
        (beneficiario.creadoPor = body.creadoPor),
        (beneficiario.motivoEgreso = body.motivoEgreso),
        beneficiario.save((error, beneficiarioActualizado) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al actualizar beneficiario',
              error
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: 'Beneficiario actualizado correctamente',
            beneficiarioActualizado
          });
        });
    });
  },
  eliminarBeneficiario: (req, res) => {
    var id = req.params.id;
    Beneficiarios.findByIdAndDelete(id, (error, beneficiarioEliminado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al eliminar beneficiario',
          error
        });
      }
      if (!beneficiarioEliminado) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El beneficiario no existe'
        });
      }
      Uds.findById(beneficiarioEliminado.uds, (error, unidad) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar UDS para eliminar usuario',
            error
          });
        }
        if (!unidad) {
          return res.status(500).json({
            ok: false,
            mensaje: 'UDS en usuario eliminado no existe'
          });
        }
        var i = unidad.beneficiarios.findIndex(function(element) {
          // parseo a string para validar
          return element + '' === beneficiarioEliminado._id + '';
        });
        unidad.beneficiarios.splice(i, 1);
        unidad.save((error, unidadActualizada) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'No se pudo eliminar al beneficiario de la UDS',
              error
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: 'Beneficiario eliminado correctamente',
            beneficiarioEliminado,
            udsActualizada: unidadActualizada.nombre
          });
        });
      });
    });
  }
};

function crearResponsable(respBen) {
  return new Promise((resolve, reject) => {
    // Primero buscamos si ya hay un responsable (por ejemplo una mamá que ya haya registrado otro bebé)
    RespBeneficiarios.findOne({})
      .or([
        { documento: respBen.documento },
        {
          nombre1: respBen.nombre1,
          nombre2: respBen.nombre2,
          apellido1: respBen.apellido1,
          apellido2: respBen.apellido2,
          nacimiento: respBen.nacimiento
        }
      ])
      .exec((error, responsable) => {
        if (error) {
          reject({
            ok: false,
            mensaje: 'Error al buscar responsable de beneficiario',
            errors
          });
        }
        if (!responsable) {
          // Si no existe, creamos uno
          var nuevoRespBeneficiario = new RespBeneficiarios(respBen);
          // Guardamos
          nuevoRespBeneficiario.save((error, responsableCreado) => {
            if (error) {
              reject({
                ok: false,
                mensaje: 'Error al crear responsablebeneficiario',
                error
              });
            }
            resolve(responsableCreado);
          });
        } else {
          resolve(responsable);
        }
      });
  });
}

function crearBeneficiario(beneficiario) {
  // console.log(beneficiario, 'ben');
  return new Promise((resolve, reject) => {
    Beneficiarios.findOne(
      { documento: beneficiario.documento },
      (error, beneficiarioExiste) => {
        if (error) {
          reject({
            ok: false,
            mensaje: 'Error al buscar beneficiario',
            error
          });
        }
        if (!beneficiarioExiste) {
          // console.log('Beneficiario no existe, creando...');
          var nuevoBeneficiario = new Beneficiarios(beneficiario);
          nuevoBeneficiario.save((error, beneficiarioCreado) => {
            if (error) {
              reject({
                ok: false,
                mensaje: 'Error al crear beneficiario',
                error
              });
            } else {
              // console.log('ben creado', beneficiarioCreado);
              resolve(beneficiarioCreado);
            }
          });
        } else {
          if (beneficiarioExiste.estado === 'Desvinculado') {
            Uds.findById(beneficiarioExiste.uds, (error, unidad) => {
              if (error) {
                reject({
                  ok: false,
                  mensaje: 'Error al eliminar beneficiario de UDS anterior',
                  error
                });
              }
              if (!unidad) {
                reject({
                  ok: false,
                  mensaje: 'No existe la UDS seleccionada'
                });
              }
              let indiceBeneficiario = unidad.beneficiarios.indexOf(
                beneficiarioExiste._id
              );
              unidad.beneficiarios.splice(indiceBeneficiario, 1);
              unidad.save((error, unidadActualizada) => {
                if (error) {
                  reject({
                    ok: false,
                    mensaje: 'Error al eliminar beneficiario de UDS anterior',
                    error
                  });
                }
              });
            });
            beneficiarioExiste.uds = beneficiario.uds;
            beneficiarioExiste.estado = 'Pendiente vincular';
            beneficiarioExiste.save((error, beneficiarioActualizado) => {
              if (error) {
                reject({
                  ok: false,
                  mensaje: 'Error al actualizar beneficiario existente',
                  error
                });
              }
              resolve(beneficiarioActualizado);
            });
          } else {
            reject({
              ok: false,
              mensaje:
                'Error al actualizar beneficiario existente, este debe estar desviculado antes de poder vincularlo nuevamente',
              error: {
                error: {
                  message: ''
                }
              }
            });
          }
        }
      }
    );
  });
}

function guardarBeneficiarioEnUds(beneficiarioId, udsId) {
  return new Promise((resolve, reject) => {
    Uds.findById(udsId, (error, unidad) => {
      if (error) {
        reject({
          ok: false,
          mensaje: 'Error al buscar UDS para guardar beneficiario',
          errors
        });
      }
      if (!unidad) {
        reject({
          ok: false,
          mensaje: 'La UDS no existe',
          errors
        });
      }
      unidad.beneficiarios.push(beneficiarioId);
      unidad.save((error, unidadActualizada) => {
        if (error) {
          reject({
            ok: false,
            mensaje: 'Error al guardar beneficiario en la UDS',
            errors
          });
        } else {
          resolve(unidadActualizada);
        }
      });
    });
  });
}

/**
 * Recibe criterios de consulta y propiedad para devolver
 * un arreglo con los filtros requeridos por el método or()
 * de una consulta a mongoDB
 * @param {string} consulta
 * @param {string} propiedad
 */
function retornarFiltro(consulta, propiedad) {
  let condiciones = [];
  const filtro = [];
  // Al ser un criterio de 2 palabras 'Pendiente vincular', la pasamos completa
  if (consulta.includes('Pendiente') || consulta.includes('Dato')) {
    condiciones.push(consulta);
  } else {
    condiciones = consulta.split(' ');
  }

  condiciones.forEach(condicion => {
    if (condicion === 'null') {
      condicion = null;
    }
    let obj = new Object();
    obj[propiedad] = condicion;
    filtro.push(obj);
  });

  return filtro;
}

module.exports = controller;
