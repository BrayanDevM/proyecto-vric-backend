'use strict';
const Beneficiarios = require('../models/beneficiarios.model');
const Madres = require('../models/madres-beneficiarios.model');
const Padres = require('../models/padres-beneficiarios.model');
const RespBeneficiarios = require('../models/respBeneficiarios.model');
const Uds = require('../models/uds.model');

const controller = {
  traerBeneficiarios: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const estado = req.query.estado;
    const criterio = req.query.criterio;
    const tipoDoc = req.query.tipoDoc;
    const paisNacimiento = req.query.paisNacimiento;
    const autorreconocimiento = req.query.autorreconocimiento;
    const discapacidad = req.query.discapacidad;
    const uds = req.query.uds;
    const valorDiscapacidad = () => {
      if (req.query.discapacidad === 'no') {
        return false;
      } else {
        return true;
      }
    };
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let criterioBusqueda = new Object();
    if (estado !== undefined) {
      criterioBusqueda.estado = estado;
    }
    if (criterio !== undefined) {
      criterioBusqueda.criterio = criterio;
    }
    if (tipoDoc !== undefined) {
      criterioBusqueda.tipoDoc = tipoDoc;
    }
    if (paisNacimiento !== undefined) {
      criterioBusqueda.paisNacimiento = paisNacimiento;
    }
    if (autorreconocimiento !== undefined) {
      criterioBusqueda.autorreconocimiento = autorreconocimiento;
    }
    if (discapacidad !== undefined) {
      criterioBusqueda.discapacidad = valorDiscapacidad();
    }
    if (uds !== undefined) {
      criterioBusqueda.uds = uds;
    }

    Beneficiarios.find(criterioBusqueda)
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
  },
  traerBeneficiarios_responsables: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const estado = req.query.estado;
    const criterio = req.query.criterio;
    const tipoDoc = req.query.tipoDoc;
    const paisNacimiento = req.query.paisNacimiento;
    const autorreconocimiento = req.query.autorreconocimiento;
    const discapacidad = req.query.discapacidad;
    const uds = req.query.uds;
    const valorDiscapacidad = () => {
      if (req.query.discapacidad === 'no') {
        return false;
      } else {
        return true;
      }
    };
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let criterioBusqueda = new Object();
    if (estado !== undefined) {
      criterioBusqueda.estado = estado;
    }
    if (criterio !== undefined) {
      criterioBusqueda.criterio = criterio;
    }
    if (tipoDoc !== undefined) {
      criterioBusqueda.tipoDoc = tipoDoc;
    }
    if (paisNacimiento !== undefined) {
      criterioBusqueda.paisNacimiento = paisNacimiento;
    }
    if (autorreconocimiento !== undefined) {
      criterioBusqueda.autorreconocimiento = autorreconocimiento;
    }
    if (discapacidad !== undefined) {
      criterioBusqueda.discapacidad = valorDiscapacidad();
    }
    if (uds !== undefined) {
      criterioBusqueda.uds = uds;
    }

    Beneficiarios.find(criterioBusqueda)
      .skip(desde)
      .limit(limite)
      .sort('nombre1')
      .populate('uds', 'nombre codigo docentes coordinador')
      .populate('creadoPor', 'nombre correo telefono')
      .populate('responsableId')
      .populate('madreId')
      .populate('padreId')
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
            cuenta: beneficiarios.length,
            registros
          });
        });
      });
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
      .populate('uds', 'nombre codigo docentes coordinador')
      .populate('creadoPor', 'nombre correo telefono')
      .populate('responsableId')
      .populate('madreId')
      .populate('padreId')
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
    const body = req.body;
    const fecha = body.fecha;
    const respBen = {
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
    const madreBen = {
      // Creo objeto con datos de madre del beneficiario
      tipoDoc: body.madreTipoDoc,
      documento: body.madreDocumento,
      nombre1: body.madreNombre1,
      nombre2: body.madreNombre2,
      apellido1: body.madreApellido1,
      apellido2: body.madreApellido2,
      nacimiento: body.madreNacimiento,
      sexo: body.madreSexo,
      creadoPor: req.solicitadoPor._id,
      creadoEl: fecha
    };
    const padreBen = {
      // Creo objeto con datos de padre del beneficiario
      tipoDoc: body.padreTipoDoc,
      documento: body.padreDocumento,
      nombre1: body.padreNombre1,
      nombre2: body.padreNombre2,
      apellido1: body.padreApellido1,
      apellido2: body.padreApellido2,
      nacimiento: body.padreNacimiento,
      sexo: body.padreSexo,
      creadoPor: req.solicitadoPor._id,
      creadoEl: fecha
    };
    let beneficiario = {
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
      madreId: null,
      padreId: null,
      criterio: body.criterio,
      infoCriterio: body.infoCriterio,
      comentario: body.comentario,
      uds: body.udsId,
      creadoPor: req.solicitadoPor._id,
      creadoEl: fecha
    };
    // console.log(body, '<-body');
    let beneficiarioCreado;
    let responsableCreado;
    let madreCreada;
    let padreCreado;

    let noEnvianMadre = false;
    if (
      madreBen.documento === undefined ||
      madreBen.documento === null ||
      madreBen.documento === ''
    ) {
      noEnvianMadre = true;
    }
    let noEnvianPadre = false;
    if (
      padreBen.documento === undefined ||
      padreBen.documento === null ||
      padreBen.documento === ''
    ) {
      noEnvianPadre = true;
    }
    // Si no se envían padres, se crea sin ellos
    if (noEnvianMadre && noEnvianPadre) {
      madreCreada = 'No se registró ninguna';
      padreCreado = 'No se registró ninguno';
      crearResponsable(respBen)
        .then(responsable => {
          beneficiario.responsableId = responsable._id;
          responsableCreado = responsable; // para response
          return crearBeneficiario(beneficiario);
        })
        .then(beneficiario => {
          beneficiarioCreado = beneficiario; // para response
          return guardarBeneficiarioEnUds(beneficiario._id, beneficiario.uds);
        })
        .then(udsActualizada => {
          res.status(200).json({
            ok: true,
            mensaje: 'Beneficiario creado correctamente',
            beneficiarioCreado,
            responsableCreado,
            madreCreada,
            padreCreado
          });
        })
        .catch(error => console.log(error));
      return;
    }
    // Si no envían madre, se crea sólo el padre
    if (noEnvianMadre) {
      madreCreada = 'No se registró ninguna';
      Promise.all([crearPadre(padreBen)])
        .then(result => {
          beneficiario.padreId = result[0]._id;
          padreCreado = result[0]; // para response
          return crearResponsable(respBen);
        })
        .then(responsable => {
          beneficiario.responsableId = responsable._id;
          responsableCreado = responsable; // para response
          return crearBeneficiario(beneficiario);
        })
        .then(beneficiario => {
          beneficiarioCreado = beneficiario; // para response
          return guardarBeneficiarioEnUds(beneficiario._id, beneficiario.uds);
        })
        .then(udsActualizada => {
          res.status(200).json({
            ok: true,
            mensaje: 'Beneficiario creado correctamente',
            beneficiarioCreado,
            responsableCreado,
            madreCreada,
            padreCreado
          });
        })
        .catch(error => console.log(error));
      return;
    }
    // Si no envían padre se crea sólo la madre
    if (noEnvianPadre) {
      padreCreado = 'No se registró ninguno';
      Promise.all([crearMadre(madreBen)])
        .then(result => {
          beneficiario.madreId = result[0]._id;
          madreCreada = result[0]; // para response
          return crearResponsable(respBen);
        })
        .then(responsable => {
          beneficiario.responsableId = responsable._id;
          responsableCreado = responsable; // para response
          return crearBeneficiario(beneficiario);
        })
        .then(beneficiario => {
          beneficiarioCreado = beneficiario; // para response
          return guardarBeneficiarioEnUds(beneficiario._id, beneficiario.uds);
        })
        .then(udsActualizada => {
          res.status(200).json({
            ok: true,
            mensaje: 'Beneficiario creado correctamente',
            beneficiarioCreado,
            responsableCreado,
            madreCreada,
            padreCreado
          });
        })
        .catch(error => console.log(error));
      return;
    }
    // Si envían padres creamos madre y padre
    Promise.all([crearMadre(madreBen), crearPadre(padreBen)])
      .then(result => {
        beneficiario.madreId = result[0]._id;
        madreCreada = result[0]; // para response
        beneficiario.padreId = result[1]._id;
        padreCreado = result[1]; // para response
        return crearResponsable(respBen);
      })
      .then(responsable => {
        beneficiario.responsableId = responsable._id;
        responsableCreado = responsable; // para response
        return crearBeneficiario(beneficiario);
      })
      .then(beneficiario => {
        beneficiarioCreado = beneficiario; // para response
        return guardarBeneficiarioEnUds(beneficiario._id, beneficiario.uds);
      })
      .then(udsActualizada => {
        res.status(200).json({
          ok: true,
          mensaje: 'Beneficiario creado correctamente',
          beneficiarioCreado,
          responsableCreado,
          madreCreada,
          padreCreado
        });
      })
      .catch(error => console.log(error));
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
function crearMadre(madreBen) {
  return new Promise((resolve, reject) => {
    // Primero buscamos si ya hay un registro (por ejemplo una mamá que ya haya registrado otro bebé)
    Madres.findOne({})
      .or([
        { documento: madreBen.documento },
        {
          nombre1: madreBen.nombre1,
          nombre2: madreBen.nombre2,
          apellido1: madreBen.apellido1,
          apellido2: madreBen.apellido2,
          nacimiento: madreBen.nacimiento
        }
      ])
      .exec((error, madre) => {
        if (error) {
          reject({
            ok: false,
            mensaje: 'Error al buscar madre de beneficiario',
            errors
          });
        }
        if (!madre) {
          // Si no existe, creamos uno
          const madreNueva = new Madres(madreBen);
          // Guardamos
          madreNueva.save((error, madreCreada) => {
            if (error) {
              reject({
                ok: false,
                mensaje: 'Error al crear Madre del beneficiario',
                error
              });
            }
            resolve(madreCreada);
          });
        } else {
          resolve(madre);
        }
      });
  });
}
function crearPadre(padreBen) {
  return new Promise((resolve, reject) => {
    // Primero buscamos si ya hay un registro (por ejemplo una mamá que ya haya registrado otro bebé)
    Padres.findOne({})
      .or([
        { documento: padreBen.documento },
        {
          nombre1: padreBen.nombre1,
          nombre2: padreBen.nombre2,
          apellido1: padreBen.apellido1,
          apellido2: padreBen.apellido2,
          nacimiento: padreBen.nacimiento
        }
      ])
      .exec((error, padre) => {
        if (error) {
          reject({
            ok: false,
            mensaje: 'Error al buscar Padre de beneficiario',
            errors
          });
        }
        if (!padre) {
          // Si no existe, creamos uno
          const padreNuevo = new Padres(padreBen);
          // Guardamos
          padreNuevo.save((error, padreCreado) => {
            if (error) {
              reject({
                ok: false,
                mensaje: 'Error al crear Padre de beneficiario',
                error
              });
            }
            resolve(padreCreado);
          });
        } else {
          resolve(padre);
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
          const beneficiarioNuevo = new Beneficiarios(beneficiario);
          beneficiarioNuevo.save((error, beneficiarioCreado) => {
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

module.exports = controller;
