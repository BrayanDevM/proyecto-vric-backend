const { io } = require('../app');
const { Notificaciones } = require('../classes/notificaciones');

const notificaciones = new Notificaciones();

io.on('connection', client => {
  // console.log('Un usuario se ha conectado');

  client.on('disconnect', () => {
    // console.log('Un usuario se ha desconectado');
  });

  /**
   * Cuando se crea una notificación general, se guarda en BD y se emite
   * a todos los usuarios
   */
  client.on('crearNotificacionGeneral', (notificacion, callback) => {
    callback(
      notificaciones
        .crearNotificacion(notificacion)
        .then(resp => {
          client.broadcast.emit('enviarNotificacionGeneral', resp);
        })
        .catch(error => console.log(error))
    );
  });

  /**
   * Cuando se marca como leída, se actualiza y retorna true
   */
  client.on('marcarComoLeida', (data, callback) => {
    console.log('entra a leida');
    callback(
      notificaciones.marcarComoLeida(data).then(resp => {
        console.log(resp, 'notificación de usuario leída');
        return true;
      })
    );
  });
  /**
   * Cuando se marca como NO leída, se actualiza y retorna true
   */
  client.on('marcar_ComoSinLeer', (data, callback) => {
    console.log('entra a no leida');
    callback(
      notificaciones.marcarComoNoLeida(data).then(resp => {
        console.log(data, 'notificación de usuario no leída');
        return true;
      })
    );
  });
});
