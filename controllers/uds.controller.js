'use strict';
const Uds = require('../models/uds.model');
const Usuarios = require('../models/usuarios.model');

const controller = {
  traerUds: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const enContrato = req.query.enContrato;
    const arriendo = req.query.arriendo;
    const activa = req.query.activa;
    const coordinador = req.query.coordinador;
    const gestor = req.query.gestor;
    const docentes = req.query.docentes;
    const cupos = req.query.cupos;
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let filtro = [];

    // filtro por contrato
    if (enContrato !== undefined) {
      filtro = retornarFiltro(enContrato, 'enContrato');
    }

    // filtro por arriendo
    if (arriendo === 'si') {
      filtro.push({ arriendo: true });
    } else if (arriendo === 'no') {
      filtro.push({ arriendo: false });
    }
    // filtro por activa (estado)
    if (activa === 'si') {
      filtro.push({ activa: true });
    } else if (activa === 'no') {
      filtro.push({ activa: false });
    }

    // filtro por coordinador
    if (coordinador !== undefined) {
      filtro = retornarFiltro(coordinador, 'coordinador');
    }
    // filtro por gestor
    if (gestor !== undefined) {
      filtro = retornarFiltro(gestor, 'gestor');
    }
    // filtro por docente
    if (docentes !== undefined) {
      filtro = retornarFiltro(docentes, 'docentes');
    }
    // filtro por cupos
    if (cupos !== undefined) {
      filtro = retornarFiltro(cupos, 'cupos');
    }

    // Si el no usuario envía filtro de búsqueda devolvemos todo
    if (filtro.length === 0) {
      Uds.find({})
        .skip(desde)
        .limit(limite)
        .populate('coordinador', 'nombre')
        .populate('docentes', 'nombre')
        .populate('gestor', 'nombre')
        .populate('enContrato', 'codigo')
        .populate('creadoPor', 'nombre')
        .sort('nombre')
        .exec((error, uds) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer UDS',
              error
            });
          }
          Uds.countDocuments().exec((error, registros) => {
            return res.status(200).json({
              ok: true,
              uds,
              registros
            });
          });
        });
    } else {
      // Si envía, buscamos por filtro
      Uds.find({})
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .populate('coordinador', 'nombre')
        .populate('docentes', 'nombre')
        .populate('gestor', 'nombre')
        .populate('enContrato', 'codigo')
        .populate('creadoPor', 'nombre')
        .sort('nombre')
        .exec((error, uds) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer UDS',
              error
            });
          }
          Uds.countDocuments()
            .or(filtro)
            .exec((error, registros) => {
              return res.status(200).json({
                ok: true,
                uds,
                registros
              });
            });
        });
    }
  },
  traerUds_beneficiarios: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const enContrato = req.query.enContrato;
    const arriendo = req.query.arriendo;
    const coordinador = req.query.coordinador;
    const gestor = req.query.gestor;
    const docentes = req.query.docentes;
    const cupos = req.query.cupos;
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let filtro = [];

    // filtro por contrato
    if (enContrato !== undefined) {
      filtro = retornarFiltro(enContrato, 'enContrato');
    }

    // filtro por arriendo
    if (arriendo === 'si') {
      filtro.push({ arriendo: true });
    } else if (arriendo === 'no') {
      filtro.push({ arriendo: false });
    }

    // filtro por coordinador
    if (coordinador !== undefined) {
      filtro = retornarFiltro(coordinador, 'coordinador');
    }
    // filtro por gestor
    if (gestor !== undefined) {
      filtro = retornarFiltro(gestor, 'gestor');
    }
    // filtro por docente
    if (docentes !== undefined) {
      filtro = retornarFiltro(docentes, 'docentes');
    }
    // filtro por cupos
    if (cupos !== undefined) {
      filtro = retornarFiltro(cupos, 'cupos');
    }

    // Si el no usuario envía filtro de búsqueda devolvemos todo
    if (filtro.length === 0) {
      Uds.find({})
        .skip(desde)
        .limit(limite)
        .populate('coordinador', 'nombre')
        .populate('docentes', 'nombre')
        .populate('gestor', 'nombre')
        .populate('enContrato', 'codigo')
        .populate('creadoPor', 'nombre')
        .populate('beneficiarios')
        .exec((error, uds) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer UDS',
              error
            });
          }
          Uds.countDocuments().exec((error, registros) => {
            return res.status(200).json({
              ok: true,
              uds,
              registros
            });
          });
        });
    } else {
      // Si envía, buscamos por filtro
      Uds.find({})
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .populate('coordinador', 'nombre')
        .populate('docentes', 'nombre')
        .populate('gestor', 'nombre')
        .populate('enContrato', 'codigo')
        .populate('creadoPor', 'nombre')
        .populate('beneficiarios')
        .exec((error, uds) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer UDS',
              error
            });
          }
          Uds.countDocuments()
            .or(filtro)
            .exec((error, registros) => {
              return res.status(200).json({
                ok: true,
                uds,
                registros
              });
            });
        });
    }
  },
  traerUds_beneficiarios_responsables: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const enContrato = req.query.enContrato;
    const arriendo = req.query.arriendo;
    const coordinador = req.query.coordinador;
    const gestor = req.query.gestor;
    const docentes = req.query.docentes;
    const cupos = req.query.cupos;
    // Si se envía más de un criterio se agrega c/u al arreglo como objeto
    let filtro = [];

    // filtro por contrato
    if (enContrato !== undefined) {
      filtro = retornarFiltro(enContrato, 'enContrato');
    }

    // filtro por arriendo
    if (arriendo === 'si') {
      filtro.push({ arriendo: true });
    } else if (arriendo === 'no') {
      filtro.push({ arriendo: false });
    }

    // filtro por coordinador
    if (coordinador !== undefined) {
      filtro = retornarFiltro(coordinador, 'coordinador');
    }
    // filtro por gestor
    if (gestor !== undefined) {
      filtro = retornarFiltro(gestor, 'gestor');
    }
    // filtro por docente
    if (docentes !== undefined) {
      filtro = retornarFiltro(docentes, 'docentes');
    }
    // filtro por cupos
    if (cupos !== undefined) {
      filtro = retornarFiltro(cupos, 'cupos');
    }

    // Si el no usuario envía filtro de búsqueda devolvemos todo
    if (filtro.length === 0) {
      Uds.find({})
        .skip(desde)
        .limit(limite)
        .populate('coordinador', 'nombre')
        .populate('docentes', 'nombre')
        .populate('gestor', 'nombre')
        .populate('enContrato', 'codigo')
        .populate('creadoPor', 'nombre')
        .populate({
          path: 'beneficiarios',
          options: { sort: 'nombre1' },
          populate: [
            { path: 'responsableId' },
            { path: 'madreId' },
            { path: 'padreId' },
            { path: 'creadoPor', select: 'nombre correo' }
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
          Uds.countDocuments().exec((error, registros) => {
            return res.status(200).json({
              ok: true,
              uds,
              registros
            });
          });
        });
    } else {
      // Si envía, buscamos por filtro
      Uds.find({})
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .populate('coordinador', 'nombre')
        .populate('docentes', 'nombre')
        .populate('gestor', 'nombre')
        .populate('enContrato', 'codigo')
        .populate('creadoPor', 'nombre')
        .populate({
          path: 'beneficiarios',
          options: { sort: 'nombre1' },
          populate: [
            { path: 'responsableId' },
            { path: 'creadoPor', select: 'nombre correo' }
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
          Uds.countDocuments()
            .or(filtro)
            .exec((error, registros) => {
              return res.status(200).json({
                ok: true,
                uds,
                registros
              });
            });
        });
    }
  },
  traerUds_codigos: (req, res) => {
    // trae sólo código y nombre
    const docente = req.query.docente;
    const gestor = req.query.gestor;
    const coordinador = req.query.coordinador;
    let filtro = {};

    if (docente !== undefined) {
      filtro = { docentes: docente };
    }
    if (gestor !== undefined) {
      filtro = { gestor };
    }
    if (coordinador !== undefined) {
      filtro = { coordinador };
    }

    Uds.find(filtro)
      .select('codigo nombre')
      .sort('nombre')
      .exec((error, uds) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al traer UDS',
            error
          });
        }
        Uds.countDocuments().exec((error, registros) => {
          return res.status(200).json({
            ok: true,
            uds,
            registros
          });
        });
      });
  },
  traerUnidad: (req, res) => {
    const id = req.params.id;

    Uds.findById(id)
      .populate('coordinador', 'nombre')
      .populate('docentes', 'nombre')
      .populate('gestor', 'nombre')
      .populate('enContrato', 'codigo')
      .populate('creadoPor', 'nombre')
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
  traerUnidad_beneficiarios: (req, res) => {
    const id = req.params.id;

    Uds.findById(id)
      .populate('coordinador', 'nombre')
      .populate('docentes', 'nombre')
      .populate('gestor', 'nombre')
      .populate('enContrato', 'codigo')
      .populate('creadoPor', 'nombre')
      .populate({
        path: 'beneficiarios',
        options: { sort: 'nombre1' },
        populate: [{ path: 'creadoPor', select: 'nombre correo' }]
      })
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
  traerUnidad_beneficiarios_responsables: (req, res) => {
    const id = req.params.id;

    Uds.findById(id)
      .populate('coordinador', 'nombre')
      .populate('docentes', 'nombre')
      .populate('gestor', 'nombre')
      .populate('enContrato', 'codigo')
      .populate('creadoPor', 'nombre')
      .populate({
        path: 'beneficiarios',
        options: { sort: 'nombre1' },
        populate: [
          { path: 'creadoPor', select: 'nombre correo' },
          { path: 'responsableId' },
          { path: 'madreId' },
          { path: 'padreId' }
        ]
      })
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
      // console.log(uds);
      /**
       * Si algun coord, gestor o docentes no se envían se recibe null
       * Por si se quiere hacer una modificación para guardarlos, es decir
       * se debe crear la UDS sin asignar responsables y luego editarla y asignarlos
       * así se asegura que se envíen los 3 responsables en una sola petición
       */
      // Promise.all([
      //   asignarUdsACoord(uds.coordinador, udsCreada._id),
      //   asignarUdsAGestor(uds.gestor, udsCreada._id),
      //   asignarUdsADocentes(uds.docentes, udsCreada._id)
      // ]).then(usuariosActualizados => {
      //   if (error) {
      //     return res.status(500).json({
      //       ok: false,
      //       mensaje: 'Error al actualizar UDS',
      //       error
      //     });
      //   }
      //   return res.status(200).json({
      //     ok: true,
      //     mensaje: 'UDS creada correctamente',
      //     udsCreada,
      //     coordinadorActualizado: usuariosActualizados[0],
      //     GestorActualizado: usuariosActualizados[1],
      //     DocentesActualizadas: usuariosActualizados[2]
      //   });
      // });
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
      /**
       * Se debe tener en cuenta que se reasignan a la UDS lo que se envía desde
       * el formulario de edición y luego se asigna el _id de la UDS al usuario
       * pero! no estamos eliminando el _id de la UDS al usuario que ya no la tiene...!?
       */
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

/**
 * Recibe criterios de consulta y propiedad para devolver
 * un arreglo con los filtros requeridos por el método or()
 * de una consulta a mongoDB
 * @param {string} consulta
 * @param {string} propiedad
 */
function retornarFiltro(consulta, propiedad) {
  const filtro = [];
  let condiciones = consulta.split(' ');

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
