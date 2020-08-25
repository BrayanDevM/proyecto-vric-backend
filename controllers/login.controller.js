'use strict';
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();

// Plantilla HTML
let respuestaHTML =
  '<html><head><title>Google</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';

const controller = {
  login: (req, res) => {
    let body = req.body;
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
      let token = jwt.sign({ usuario: usuario }, process.env.TOKEN_SEED, {
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
    let token = jwt.sign({ usuario: req.user }, process.env.TOKEN_SEED, {
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
    // req.session = null;
    req.logout();
    // res.redirect('/');
  },
  renuevaToken: (req, res) => {
    // Creación de Jason Web Token
    let usuario = req.solicitadoPor;
    let token = jwt.sign({ usuario: usuario }, process.env.TOKEN_SEED, {
      expiresIn: 14400
    }); // 4 horas
    res.status(200).json({
      ok: true,
      nuevoToken: token
    });
  }
};

function obtenerMenu(rolUsuario) {
  const menu = [
    {
      titulo: 'PANEL DE CONTROL',
      subtitulo: 'Métricas generales',
      items: [
        {
          nombre: 'Análiticas',
          gIcon: 'pie_chart',
          url: '/dashboard'
        }
      ]
    },
    {
      titulo: 'PÁGINAS',
      subtitulo: 'Información del servicio',
      items: []
    }
  ];

  if (rolUsuario !== 'DOCENTE') {
    menu[1].items.push(
      {
        nombre: 'Contratos',
        gIcon: 'book',
        url: '/contratos'
      },
      {
        nombre: 'Unidades De Servicio',
        gIcon: 'home_work',
        url: '/unidades-de-servicio'
      },
      {
        nombre: 'Beneficiarios',
        gIcon: 'group',
        url: '/beneficiarios'
      }
    );
  }
  if (rolUsuario === 'DOCENTE' || rolUsuario === 'ADMIN') {
    menu[1].items.push(
      {
        nombre: 'Beneficiarios',
        gIcon: 'group',
        url: '/beneficiarios'
      },
      {
        nombre: 'Novedades',
        gIcon: 'swap_horizontal_circle',
        url: '/novedades'
      }
    );
  }
  if (rolUsuario === 'ADMIN') {
    menu[1].items.splice(2, 1); // elimino beneficiarios (duplicado)
    menu.push({
      titulo: 'ADMINISTRACIÓN',
      subtitulo: 'Ajustes y configuración',
      items: [
        {
          nombre: 'Usuarios',
          gIcon: 'assignment_ind',
          url: '/usuarios'
        },
        {
          nombre: 'Administrar',
          gIcon: 'admin_panel_settings',
          url: '/administrar'
        }
      ]
    });
  }

  return menu;
}

module.exports = controller;
