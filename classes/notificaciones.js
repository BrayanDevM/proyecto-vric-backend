const notificacionesModel = require('../models/notificaciones.model');

class Notificaciones {
  hoy = new Date();

  constructor() {}

  obtenerNotificaciones(usuarioId, desde, hasta) {
    return new Promise((resolve, reject) => {
      notificacionesModel
        .find({ $or: [{ _id: usuarioId }, { general: true }] })
        .skip(desde)
        .limit(hasta)
        .sort('-fechaCreada')
        .exec((error, notificaciones) => {
          if (error) {
            reject({
              ok: false,
              status: 500,
              mensaje: 'Error al traer notificaciones',
              error
            });
          }
          resolve({
            ok: true,
            status: 200,
            notificaciones
          });
        });
    });
  }

  crearNotificacion(notificacion) {
    return new Promise((resolve, reject) => {
      const nuevaNotificacion = new notificacionesModel(notificacion);

      nuevaNotificacion.fechaCreada = this.hoy;
      nuevaNotificacion.save((error, creada) => {
        if (error) {
          reject({
            ok: false,
            status: 500,
            mensaje: 'Error al crear notificacion',
            error
          });
        }
        resolve({
          ok: true,
          status: 200,
          creada
        });
      });
    });
  }

  marcarComoLeida(data) {
    return new Promise((resolve, reject) => {
      notificacionesModel
        .findById(data._id)
        .exec((errorBuscar, notificacion) => {
          if (errorBuscar) {
            reject({
              ok: false,
              status: 500,
              mensaje: 'Error al obtener notificación',
              errorBuscar
            });
          }
          if (!notificacion) {
            reject({
              ok: false,
              status: 400,
              mensaje: 'La notificación no existe'
            });
          }
          const i = notificacion.leidaPor.findIndex(id => {
            return (id = data.leidaPor);
          });
          // si antes ya no se ha leído
          if (!notificacion.leidaPor.includes(data.leidaPor)) {
            notificacion.leidaPor.push(data.leidaPor);
            notificacion.save((error, marcadaComoLeida) => {
              if (error) {
                reject({
                  ok: false,
                  status: 500,
                  mensaje: 'Error al actualizar notificación',
                  error
                });
              }
              resolve({
                ok: true,
                status: 200,
                marcadaComoLeida
              });
            });
          } else {
            resolve({
              ok: true,
              status: 200,
              mensaje: 'Ya se ha marcado como leída'
            });
          }
        });
    });
  }

  marcarComoNoLeida(data) {
    return new Promise((resolve, reject) => {
      notificacionesModel
        .findById(data._id)
        .exec((errorBuscar, notificacion) => {
          if (errorBuscar) {
            reject({
              ok: false,
              status: 500,
              mensaje: 'Error al obtener notificación',
              errorBuscar
            });
          }
          if (!notificacion) {
            reject({
              ok: false,
              status: 400,
              mensaje: 'La notificación no existe'
            });
          }
          if (notificacion.leidaPor.includes(data.leidaPor)) {
            const i = notificacion.leidaPor.findIndex(id => {
              return (id = data.leidaPor);
            });
            notificacion.leidaPor.splice(i, 1);
            notificacion.save((error, marcadaComoLeida) => {
              if (error) {
                reject({
                  ok: false,
                  status: 500,
                  mensaje: 'Error al actualizar notificación',
                  error
                });
              }
              resolve({
                ok: true,
                status: 200,
                marcadaComoLeida
              });
            });
          } else {
            resolve({
              ok: true,
              status: 200,
              mensaje: 'Ya se ha marcado como no leída'
            });
          }
        });
    });
  }
}

module.exports = {
  Notificaciones
};
