'use strict';
var Usuarios = require('../models/usuarios.model');
var Uds = require('../models/uds.model');
var bcrypt = require('bcrypt');

var controller = {
  obtenerUsuarios: (req, res) => {
    var desde = req.query.desde || 0; // Variable para realizar paginación (desde)
    desde = Number(desde);
    if (isNaN(desde)) {
      desde = 0;
    }

    Usuarios.find({})
      .skip(desde)
      .limit(50)
      // .populate('uds')
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
  },
  obtenerUsuario: (req, res) => {
    const id = req.params.id;
    Usuarios.findOne({ _id: id }, (error, usuario) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar usuario',
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

// hacer manu dinámico

module.exports = controller;
