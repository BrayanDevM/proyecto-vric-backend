var express = require('express');
var ruta = express();
var loginController = require('../controllers/login.controller');
var authMiddleware = require('../middlewares/auth.middleware');

// Passport lib verify
const passport = require('passport');
require('../middlewares/passport.middleware');

ruta.post('/login', loginController.login);
ruta.get('/logout', loginController.logout);
ruta.get('/failed', loginController.googleFailed);
// ruta.get('/good', loginController.googleSuccess);

ruta.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

ruta.get(
  '/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  loginController.googleSuccess
);

ruta.get(
  '/renuevaToken',
  authMiddleware.verificarToken,
  loginController.renuevaToken
);

module.exports = ruta;
