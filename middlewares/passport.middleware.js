const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuarios = require('../models/usuarios.model');

passport.serializeUser((usuario, done) => {
  // console.log('-------serializar: ', usuario);
  done(null, usuario.correo);
});

passport.deserializeUser((correo, done) => {
  Usuarios.findOne({ correo: correo }).then(usuario => {
    // console.log('-------deserializar: ', usuario);
    done(null, usuario);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_LOGIN
    },
    function(token, tokenSecret, profile, done) {
      Usuarios.findOne(
        { correo: profile.emails[0].value },
        (error, usuario) => {
          if (error) {
            return done(error, null);
          }
          if (usuario) {
            if (usuario.google === false) {
              return done('Ingresa con tu usuario normal', null);
            } else {
              return done(null, usuario);
            }
          } else {
            // Si el usuario no existe en la BD
            var nuevoUsuario = new Usuarios({
              nombre: profile.displayName,
              correo: profile.emails[0].value,
              documento: documentoAleatorio(10000, 100000),
              contratos: [],
              uds: [],
              password: 'VRIC-Password',
              // img: profile.photos[0].value,
              google: true
            });
            nuevoUsuario.save((error, usuarioCreado) => {
              if (error) {
                return done('Error al crear usuario</br>' + error, error);
              }
              // console.log('-------usuario creado: ', usuarioCreado);
              return done(null, usuarioCreado);
            });
          }
        }
      );
    }
  )
);

function documentoAleatorio(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}
