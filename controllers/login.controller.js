'use strict';
var Usuarios = require('../models/usuarios.model');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// Plantilla HTML
var respuestaHTML =
  '<html><head><title>Google</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';

var controller = {
  login: (req, res) => {
    var body = req.body;
    if (
      !body.correo ||
      !body.password ||
      body.correo === '' ||
      body.password === ''
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos son obligatorios'
      });
    }
    Usuarios.findOne({ correo: body.correo }, (error, usuario) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al consultar usuario',
          error
        });
      }
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Usuario o contraseña incorrectos - email'
        });
      }
      if (!bcrypt.compareSync(body.password, usuario.password)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Usuario o contraseña incorrectos - pass'
        });
      }

      // Creación de Jason Web Token
      var token = jwt.sign({ usuario: usuario }, process.env.TOKEN_SEED, {
        expiresIn: 14400
      }); // 4 horas
      usuario.password = null;
      return res.status(200).json({
        ok: true,
        usuario,
        token,
        id: usuario.id,
        menu: obtenerMenu(usuario.rol)
      });
    });
  },
  googleFailed: (req, res) => {
    // return res.status(400).json({
    //   ok: false,
    //   mensaje: 'Error al iniciar sesión con Google account',
    // });
    respuestaHTML = respuestaHTML.replace(
      '%value%',
      JSON.stringify({
        ok: false,
        mensaje: 'Error al iniciar sesión con Google',
        error: res.error
      })
    );
    res.status(200).send(respuestaHTML);
  },
  googleSuccess: (req, res) => {
    var token = jwt.sign({ usuario: req.user }, process.env.TOKEN_SEED, {
      expiresIn: 14400
    }); // 4 horas
    // Cambiamos el valor de la contraseña para ocultarla
    req.user.password = null;
    respuestaHTML = respuestaHTML.replace(
      '%value%',
      JSON.stringify({
        ok: true,
        mensaje: 'Inicio de sesión por Google',
        usuario: req.user,
        token,
        id: req.user._id,
        menu: obtenerMenu(req.user.rol)
      })
    );
    res.status(200).send(respuestaHTML);
  },
  logout: (req, res) => {
    req.logout();
    res.redirect('/');
  }
};

function obtenerMenu(rolUsuario) {
  const menu = [
    {
      titulo: 'Dashboard',
      gIcon: 'dashboard',
      url: '/dashboard'
    }
    // {
    //   titulo: 'Beneficiarios',
    //   gIcon: 'assignment_ind',
    //   submenu: [
    //     { titulo: 'Novedades', url: '/beneficiarios/novedades' },
    //     { titulo: 'Mis beneficiarios', url: '/beneficiarios/mis-beneficiarios' }
    //   ]
    // }
  ];

  if (rolUsuario === 'ADMIN') {
    menu.push(
      {
        titulo: 'Contratos',
        gIcon: 'book',
        url: '/contratos'
      },
      {
        titulo: 'UDS',
        gIcon: 'home_work',
        url: '/uds'
      },
      {
        titulo: 'Usuarios',
        gIcon: 'account_box',
        url: '/usuarios'
      },
      {
        titulo: 'Administrar',
        gIcon: 'admin_panel_settings',
        url: '/administrar'
      }
    );
  }

  return menu;
}

module.exports = controller;
