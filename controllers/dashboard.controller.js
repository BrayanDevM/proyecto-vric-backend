'use strict';
const Uds = require('../models/uds.model');

const traerDatosDashboard = async (req, res) => {
  try {
    let criterioBusqueda = {};

    req.query.id ? (criterioBusqueda._id = req.query.id) : null;

    const uds = await Uds.find(criterioBusqueda)
      .select('cupos ubicacion activa nombre')
      .populate({
        path: 'beneficiarios',
        select:
          'discapacidad criterio estado egreso tipoDoc nacimiento sexo paisNacimiento ingreso autorreconocimiento uds',
      });
    const conteo = await Uds.countDocuments();
    return res.status(200).json({
      ok: true,
      uds,
      conteo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al traer UDS',
      error,
    });
  }
};

module.exports = {
  traerDatosDashboard,
};
