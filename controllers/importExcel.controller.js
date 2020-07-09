'use strict';
const XLSX = require('xlsx');
const fs = require('fs');
const Beneficiarios = require('../models/beneficiarios.model');
const RespBeneficiarios = require('../models/respBeneficiarios.model');
const Uds = require('../models/uds.model');

var controller = {
  importarBeneficiarios: (req, res) => {
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debes seleccionar un archivo'
      });
    }
    const archivo = req.files.archivo;
    const nombreArchivo = archivo.name.split('.');
    const extencion = nombreArchivo[nombreArchivo.length - 1];

    if (extencion !== 'xlsx') {
      return res.status(400).json({
        ok: false,
        mensaje:
          'La extensión del archivo no es válida, debe ser un archivo Excel reciente (.xlsx)'
      });
    }
    const fecha = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    const nuevoNombre = `import-${fecha}-${new Date().getMilliseconds()}.${extencion}`;
    const rutaArchivo = `./documents/${nuevoNombre}`;
    archivo.mv(rutaArchivo, (error, archivoGuardado) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          message: 'No se ha podido guardar el archivo',
          error
        });
      }

      // Leemos el archivo excel con la librería
      const excel = XLSX.readFile(rutaArchivo);
      // Obtenemos arreglo con las hojas en el libro
      const nombreHojas = excel.SheetNames;
      // Tomamos los datos de la hoja en la poscisión 0 y pasamos a json
      const datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHojas[0]]);
      const jDatos = [];
      datos.forEach(registro => {
        jDatos.push({
          ...registro,
          respDocumento: separadorMiles(
            registro.respDocumento,
            registro.respTipoDoc
          ),
          respNacimiento: formatearFechaExcel(registro.respNacimiento),
          documento: separadorMiles(registro.documento, registro.tipoDoc),
          nacimiento: formatearFechaExcel(registro.nacimiento),
          ingreso: formatearFechaExcel(registro.ingreso),
          fechaCargue: formatearFechaExcel(registro.fechaCargue),
          telefono: registro.telefono + '',
          infoCriterio: registro.infoCriterio + '',
          discapacidad: devolverBooleano(registro.discapacidad)
        });
        registro;
      });

      // Eliminamos el archivo después de obtener los datos
      fs.unlinkSync(rutaArchivo);

      importarRegistros(jDatos).then(
        result => {
          return res.status(200).json({
            ok: true,
            mensaje: 'Importación realizada correctamente',
            registrosAImportar: jDatos.length,
            registrosImportados: result.registrosImportados.length,
            importado: result
          });
        },
        error => console.log(error)
      );
    });
  }
};

function formatearFechaExcel(fechaExcel) {
  var diasUTC = Math.floor(fechaExcel - 25569);
  var valorUTC = diasUTC * 86400;
  var infoFecha = new Date(valorUTC * 1000);

  var diaFraccionado = fechaExcel - Math.floor(fechaExcel) + 0.0000001;
  var totalSegundosDia = Math.floor(86400 * diaFraccionado);
  var segundos = totalSegundosDia % 60;
  totalSegundosDia -= segundos;

  var horas = Math.floor(totalSegundosDia / (60 * 60));
  var minutos = Math.floor(totalSegundosDia / 60) % 60;

  // Convertidos a 2 dígitos
  var dia = ('0' + (infoFecha.getDate() + 1)).slice(-2);
  var mes = ('0' + (infoFecha.getMonth() + 1)).slice(-2);
  var anio = infoFecha.getFullYear();

  var fecha = `${dia}/${mes}/${anio}`;

  return fecha;
}

function separadorMiles(textoNumero, tipoDoc) {
  if (tipoDoc === 'SD') {
    let nuevoCodigo = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const caracteresLength = caracteres.length;
    for (let i = 0; i < 15; i++) {
      nuevoCodigo += caracteres.charAt(
        Math.floor(Math.random() * caracteresLength)
      );
    }
    return nuevoCodigo;
  }
  // Información función https://codepen.io/BrayanDevM/pen/MWKmgZg?editors=0011
  textoNumero += '';
  let textoReversa = textoNumero
    .split('')
    .reverse()
    .join('');
  let arrTexto = textoReversa.match(/.{1,3}/g);

  let arrTextoConPuntos = [];
  arrTexto.forEach(palabra => {
    arrTextoConPuntos.push(palabra + '.');
  });

  let ultimaPos = arrTextoConPuntos[arrTextoConPuntos.length - 1];

  arrTextoConPuntos.splice(arrTextoConPuntos.length - 1, 1);
  arrTextoConPuntos.push(ultimaPos.replace('.', ''));

  let numeroSeparado = '';
  arrTextoConPuntos.forEach(indice => {
    numeroSeparado += indice;
  });

  numeroSeparado = numeroSeparado
    .split('')
    .reverse()
    .join('');
  return numeroSeparado;
}

function devolverBooleano(texto) {
  if (texto === 'false') {
    return false;
  } else {
    return true;
  }
}

function crearResponsable(respBeneficiarioInfo) {
  return new Promise((resolve, reject) => {
    RespBeneficiarios.findOne({})
      .or([
        { documento: respBeneficiarioInfo.documento },
        {
          nombre1: respBeneficiarioInfo.nombre1,
          nombre2: respBeneficiarioInfo.nombre2,
          apellido1: respBeneficiarioInfo.apellido1,
          apellido2: respBeneficiarioInfo.apellido2,
          nacimiento: respBeneficiarioInfo.nacimiento
        }
      ])
      .exec((error, responsable) => {
        if (error) {
          reject({
            ok: false,
            mensaje: 'Error al buscar responsable de beneficiario',
            errors
          });
          console.log(error);
        }
        if (!responsable) {
          var nuevoRespBeneficiario = new RespBeneficiarios(
            respBeneficiarioInfo
          );
          nuevoRespBeneficiario.save((error, responsableCreado) => {
            if (error) {
              console.log(error);
            }
            resolve({
              existente: false,
              responsable: responsableCreado
            });
          });
        } else {
          resolve({
            existente: true,
            responsable
          });
        }
      });
  });
}

function crearBeneficiario(beneficiarioInfo) {
  // console.log('ben recibido', beneficiarioInfo);
  return new Promise((resolve, reject) => {
    Beneficiarios.findOne({})
      .or([
        { documento: beneficiarioInfo.documento },
        {
          nombre1: beneficiarioInfo.nombre1,
          nombre2: beneficiarioInfo.nombre2,
          apellido1: beneficiarioInfo.apellido1,
          apellido2: beneficiarioInfo.apellido2,
          nacimiento: beneficiarioInfo.nacimiento
        }
      ])
      .exec((error, beneficiario) => {
        if (error) {
          console.log('error ben', error);
          reject({
            ok: false,
            mensaje: 'Error al buscar beneficiario',
            errors
          });
        }
        if (!beneficiario) {
          var nuevoBeneficiario = new Beneficiarios(beneficiarioInfo);
          nuevoBeneficiario.save((error, beneficiarioCreado) => {
            if (error) {
              console.log(error);
            }
            resolve({
              existente: false,
              beneficiario: beneficiarioCreado
            });
          });
        } else {
          resolve({
            existente: true,
            beneficiario
          });
        }
      });
  });
}

function guardarBeneficiarioEnUds(beneficiario) {
  return new Promise((resolve, reject) => {
    Uds.findById(beneficiario.uds, (error, unidad) => {
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
      // Si no encuentra un beneficiario existente devolverá -1
      let i = unidad.beneficiarios.findIndex(beneficiarioId => {
        return beneficiarioId + '' === beneficiario._id + '';
      });
      if (i < 0) {
        unidad.beneficiarios.push(beneficiario._id);
        unidad.save((error, unidadActualizada) => {
          if (error) {
            console.log(error);
            reject({
              ok: false,
              mensaje: 'Error al guardar beneficiario en la UDS',
              errors
            });
          } else {
            resolve({
              existe: false,
              unidad: unidad.nombre
            });
          }
        });
      } else {
        resolve({
          benExiste: true,
          unidad: unidad.nombre
        });
      }
    });
  });
}

function importarRegistros(arrayData) {
  let registrosImportados = [];
  let totalImportados = 0;
  let beneficiariosExistentes = 0;
  let responsablesExistentes = 0;
  return new Promise(resolve => {
    arrayData.forEach(async data => {
      let respBen = {
        // Creo objeto con datos del responsable del beneficiario
        tipoDoc: data.respTipoDoc,
        documento: data.respDocumento,
        nombre1: data.respNombre1,
        nombre2: data.respNombre2,
        apellido1: data.respApellido1,
        apellido2: data.respApellido2,
        nacimiento: data.respNacimiento,
        sexo: data.respSexo,
        paisNacimiento: data.respPaisNacimiento,
        dptoNacimiento: data.respDptoNacimiento,
        municipioNacimiento: data.respMunicipioNacimiento,
        creadoPor: data.creadoPor,
        creadoEl: data.fechaCargue
      };
      let beneficiario = {
        tipoDoc: data.tipoDoc,
        documento: data.documento,
        nombre1: data.nombre1,
        nombre2: data.nombre2,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        nacimiento: data.nacimiento,
        sexo: data.sexo,
        paisNacimiento: data.paisNacimiento,
        dptoNacimiento: data.dptoNacimiento,
        municipioNacimiento: data.municipioNacimiento,
        ingreso: data.ingreso,
        discapacidad: data.discapacidad,
        infoDiscapacidad: '',
        direccion: data.direccion,
        barrio: data.barrio,
        telefono: data.telefono,
        autorreconocimiento: data.autorreconocimiento,
        tipoResponsable: data.tipoResponsable,
        responsableId: null,
        estado: 'Vinculado',
        criterio: data.criterio,
        infoCriterio: data.infoCriterio,
        comentario: null,
        uds: data.udsId,
        creadoPor: data.creadoPor,
        creadoEl: data.fechaCargue
      };
      if (data.barrio === undefined) {
        beneficiario.barrio = 'sin barrio';
      }
      let resultResp = await crearResponsable(respBen);
      resultResp.existente
        ? (responsablesExistentes += 1)
        : (responsablesExistentes += 0);
      beneficiario.responsableId = resultResp.responsable._id;
      let resultBen = await crearBeneficiario(beneficiario);
      resultBen.existente
        ? (beneficiariosExistentes += 1)
        : (beneficiariosExistentes += 0);
      let resultUds = await guardarBeneficiarioEnUds(resultBen.beneficiario);
      registrosImportados.push({
        reponsableImportado: resultResp,
        beneficiarioImportado: resultBen,
        udsActualizada: resultUds
      });
      totalImportados++;
      if (totalImportados === arrayData.length) {
        resolve({
          registrosImportados,
          beneficiariosExistentes,
          responsablesExistentes
        });
      }
    });
  });
}

module.exports = controller;
