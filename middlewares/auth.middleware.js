var jwt = require('jsonwebtoken');

// Verificar token de usuario para realizar peticiones
exports.verificarToken = (req, res, next) => {
  const token = req.query.token;
  jwt.verify(token, process.env.TOKEN_SEED, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token de autenticación inválido',
        error
      });
    }
    req.solicitadoPor = decoded.usuario;
    next();
  });
};

// Verificar ROL de usuario para realizar peticiones
exports.verificarSupervisorRol = (req, res, next) => {
  const usuario = req.solicitadoPor;
  if (usuario.rol !== 'DOCENTE') {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      mensaje:
        'Debes tener permisos de COORDINADOR, GESTOR o ADMIN para poder realizar la petición'
    });
  }
};

// Verificar ROL de usuario para realizar peticiones
exports.verificarAdminRol = (req, res, next) => {
  const usuario = req.solicitadoPor;
  if (usuario.rol === 'ADMIN') {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: 'Debes ser administrador para poder realizar la petición'
    });
  }
};

// Verificar ROL de usuario para realizar peticiones
exports.verificarMismoUsuario = (req, res, next) => {
  const usuario = req.solicitadoPor;
  const id = req.params.id;

  if (usuario._id === id || usuario.rol === 'ADMIN') {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      mensaje:
        'Debes ser administrador o el usuario propietario para poder realizar la petición'
    });
  }
};
