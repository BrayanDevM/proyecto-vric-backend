const { Notificaciones } = require('../classes/notificaciones');
const notificaciones = new Notificaciones();

const Controller = {
  obtenerNotificaciones: (req, res) => {
    const usuarioId = req.query.usuarioId;
    const desde = req.query.desde || 0;
    const hasta = req.query.hasta || 30;
    notificaciones
      .obtenerNotificaciones(usuarioId, desde, hasta)
      .then(resp => {
        return res.status(200).json(resp);
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  }
};

module.exports = Controller;
