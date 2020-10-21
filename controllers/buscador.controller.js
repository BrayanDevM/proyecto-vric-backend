'use strict';
var RespBeneficiarios = require('../models/respBeneficiarios.model');
var Beneficiarios = require('../models/beneficiarios.model');
var Contratos = require('../models/contratos.model');
var Uds = require('../models/uds.model');

var controller = {
  buscarTodos: (req, res) => {
    var criterio = req.params.criterio;
    // Si está buscando por número
    if (!isNaN(criterio)) {
      console.log('busca por número');
      var buscaNumero = criterio;
    }
    // Convierte palabra en expresión regular para buscar mayúsculas o minúsculas
    var regex = new RegExp(criterio, 'i');

    Promise.all([
      buscarRespBeneficiarios(regex, buscaNumero),
      buscarBeneficiarios(regex, buscaNumero),
      buscarContratos(regex, buscaNumero),
      buscarUds(regex, buscaNumero)
    ])
      .then(results => {
        res.status(200).json({
          ok: true,
          respBeneficiarios: results[0],
          beneficiarios: results[1],
          contratos: results[2],
          uds: results[3]
        });
      })
      .catch(error => {
        res.status(500).json({
          ok: false,
          message: 'Error al realizar búsqueda',
          error
        });
      });
  },
  BuscarPorColeccion: (req, res) => {
    var coleccion = req.params.nombreColeccion;
    var criterio = req.params.criterio;
    var regex = new RegExp(criterio, 'i');
    switch (coleccion) {
      case 'beneficiarios':
        buscarBeneficiarios(regex)
          .then(beneficiarios => {
            res.status(200).json({
              ok: true,
              beneficiarios
            });
          })
          .catch(error => {
            res.status(500).json({
              ok: false,
              message: 'Error al consultar beneficiarios',
              error
            });
          });
        break;
      case 'contratos':
        buscarContratos(regex)
          .then(contratos => {
            res.status(200).json({
              ok: true,
              contratos
            });
          })
          .catch(error => {
            res.status(500).json({
              ok: false,
              message: 'Error al consultar contratos',
              error
            });
          });
        break;
      case 'uds':
        buscarUds(regex)
          .then(uds => {
            res.status(200).json({
              ok: true,
              uds
            });
          })
          .catch(error => {
            res.status(500).json({
              ok: false,
              message: 'Error al consultar UDS',
              error
            });
          });
        break;
      case 'responsable':
        buscarRespBeneficiarios(regex)
          .then(responsable => {
            res.status(200).json({
              ok: true,
              responsable
            });
          })
          .catch(error => {
            res.status(500).json({
              ok: false,
              message: 'Error al consultar responsable de beneficiario',
              error
            });
          });
        break;

      default:
        return res.status(400).json({
          ok: false,
          message: 'La colección a buscar no existe'
        });
        break;
    }
  }
};

function buscarBeneficiarios(regex, buscaNumero) {
  return new Promise((resolve, reject) => {
    Beneficiarios.find({
      $or: [
        { documento: regex },
        { nombre1: regex },
        { nombre2: regex },
        { apellido1: regex },
        { apellido2: regex }
      ]
    })
      // .or([
      //   { documento: regex },
      //   { nombre1: regex },
      //   { nombre2: regex },
      //   { apellido1: regex },
      //   { apellido2: regex }
      // ])
      .select('nombre1 nombre2 apellido1 apellido2 estado')
      .populate({
        path: 'uds',
        select: 'nombre codigo'
      })
      .exec((error, beneficiarios) => {
        if (error) {
          console.log(error);
          reject('Error al buscar beneficiarios');
        } else {
          resolve(beneficiarios);
        }
      });
  });
}

function buscarRespBeneficiarios(regex, buscaNumero) {
  return new Promise((resolve, reject) => {
    RespBeneficiarios.find({})
      .or([
        { documento: regex },
        { nombre1: regex },
        { nombre2: regex },
        { apellido1: regex },
        { apellido2: regex }
      ])
      .exec((error, responsable) => {
        if (error) {
          console.log(error);
          reject('Error al buscar responsable');
        } else {
          resolve(responsable);
        }
      });
  });
}

function buscarContratos(regex, buscaNumero) {
  return new Promise((resolve, reject) => {
    Contratos.find({})
      .or([
        { codigo: buscaNumero },
        { cz: regex },
        { eas: regex },
        { nit: regex }
      ])
      .populate('creadoPor', 'nombre documento correo')
      .populate({
        path: 'uds',
        select: 'nombre codigo coordinador docentes gestor',
        populate: [
          { path: 'coordinador', select: 'nombre correo' },
          { path: 'docentes', select: 'nombre correo' },
          { path: 'gestor', select: 'nombre correo' }
        ]
      })
      .exec((error, contratos) => {
        if (error) {
          reject('Error al buscar contratos');
        } else {
          resolve(contratos);
        }
      });
  });
}

function buscarUds(regex, buscaNumero) {
  return new Promise((resolve, reject) => {
    Uds.find({})
      .or([{ codigo: buscaNumero }, { nombre: regex }])
      .populate('coordinador', 'nombre documento correo')
      .populate('docentes', 'nombre documento correo')
      .populate('gestor', 'nombre documento correo')
      .populate('creadoPor', 'nombre documento correo')
      .exec((error, uds) => {
        if (error) {
          reject('Error al buscar uds');
        } else {
          resolve(uds);
        }
      });
  });
}

module.exports = controller;
