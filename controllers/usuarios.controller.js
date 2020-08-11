'use strict';
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt');

const controller = {
  traerUsuarios: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const rol = req.query.rol;
    const activo = req.query.activo;
    const uds = req.query.uds;
    let filtro = [];

    if (rol !== undefined) {
      filtro = retornarFiltro(rol, 'rol');
    }
    if (activo !== undefined) {
      if (activo === 'si') {
        filtro = { activo: true };
      } else {
        filtro = { activo: false };
      }
    }
    if (uds !== undefined) {
      filtro = retornarFiltro(uds, 'uds');
    }

    if (filtro.length === 0) {
      Usuarios.find({})
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    } else {
      Usuarios.find()
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    }
  },
  traerUsuarios_uds: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const rol = req.query.rol;
    const activo = req.query.activo;
    const uds = req.query.uds;

    if (rol !== undefined) {
      filtro = retornarFiltro(rol, 'rol');
    }
    if (activo !== undefined) {
      filtro = retornarFiltro(activo, 'activo');
    }
    if (uds !== undefined) {
      filtro = retornarFiltro(uds, 'uds');
    }

    let filtro = [];

    if (filtro.length === 0) {
      Usuarios.find({})
        .skip(desde)
        .limit(limite)
        .populate('uds', 'codigo nombre')
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    } else {
      Usuarios.find()
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .populate('uds', 'codigo nombre')
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    }
  },
  traerUsuarios_contratos: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const rol = req.query.rol;
    const activo = req.query.activo;
    const uds = req.query.uds;

    if (rol !== undefined) {
      filtro = retornarFiltro(rol, 'rol');
    }
    if (activo !== undefined) {
      filtro = retornarFiltro(activo, 'activo');
    }
    if (uds !== undefined) {
      filtro = retornarFiltro(uds, 'uds');
    }

    let filtro = [];

    if (filtro.length === 0) {
      Usuarios.find({})
        .skip(desde)
        .limit(limite)
        .populate('contratos', 'codigo eas activo')
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    } else {
      Usuarios.find()
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .populate('uds', 'codigo nombre')
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    }
  },
  traerUsuarios_uds_contratos: (req, res) => {
    // Variables de filtro ?query
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // filtros
    const rol = req.query.rol;
    const activo = req.query.activo;
    const uds = req.query.uds;

    if (rol !== undefined) {
      filtro = retornarFiltro(rol, 'rol');
    }
    if (activo !== undefined) {
      filtro = retornarFiltro(activo, 'activo');
    }
    if (uds !== undefined) {
      filtro = retornarFiltro(uds, 'uds');
    }

    let filtro = [];

    if (filtro.length === 0) {
      Usuarios.find({})
        .skip(desde)
        .limit(limite)
        .populate('contratos', 'codigo eas activo')
        .populate('uds', 'codigo nombre')
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    } else {
      Usuarios.find()
        .or(filtro)
        .skip(desde)
        .limit(limite)
        .populate('uds', 'codigo nombre')
        .populate('uds', 'codigo nombre')
        .exec((error, usuarios) => {
          if (error) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al traer usuarios',
              error
            });
          }
          Usuarios.countDocuments({}, (error, registros) => {
            return res.status(200).json({
              ok: true,
              usuarios,
              registros
            });
          });
        });
    }
  },
  obtenerUsuario: (req, res) => {
    const id = req.params.id;
    Usuarios.findOne({ _id: id })
      .populate('contratos', 'codigo eas activo')
      .populate('uds', 'codigo nombre')
      .exec((error, usuario) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar usuario',
            error
          });
        }
        if (!usuario) {
          return res.status(400).json({
            ok: false,
            mensaje: 'El usuario no existe',
            error
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Usuario obtenido correctamente',
          usuario
        });
      });
  },
  crearUsuario: (req, res) => {
    var body = req.body;
    var usuario = new Usuarios({
      nombre: body.nombre,
      documento: body.documento,
      correo: body.correo,
      telefono: body.telefono,
      img: body.img,
      contratos: body.contratos,
      // uds: body.uds,
      rol: body.rol,
      activo: body.activo,
      password: bcrypt.hashSync(body.password, 10)
    });
    // Creo el usuario
    usuario.save((error, usuarioCreado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al crear usuario',
          error
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Usuario creado correctamente',
        usuarioCreado
      });
    });
  },
  actualizarUsuario: (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuarios.findById(id).exec((error, usuario) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar usuario',
          error
        });
      }
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El usuario no existe'
        });
      }
      usuario.nombre = body.nombre;
      usuario.documento = body.documento;
      usuario.correo = body.correo;
      usuario.telefono = body.telefono;
      usuario.rol = body.rol;
      usuario.contratos = body.contratos;
      usuario.uds = body.uds;
      usuario.telefono = body.telefono;
      usuario.activo = body.activo;
      if (body.password) {
        usuario.password = bcrypt.hashSync(body.password, 10);
      }
      usuario.save((error, usuarioActualizado) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar usuario',
            error
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Usuario actualizado correctamente',
          usuarioActualizado
        });
      });
    });
  },
  eliminarUsuario: (req, res) => {
    var id = req.params.id;
    Usuarios.findByIdAndDelete(id, (error, usuarioEliminado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al eliminar ususario',
          error
        });
      }
      if (!usuarioEliminado) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El usuario no existe'
        });
      }
      return res.status(200).json({
        ok: true,
        mensaje: 'Usuario eliminado correctamente',
        usuarioEliminado
      });
    });
  }
};

// hacer menu dinámico

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
  condiciones = consulta.split(' ');

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
