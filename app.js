// Requires (importaciones requeridas de 3ros)
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const puerto = process.env.PORT || 8080;

// Inicializar variables
const app = express();

// Configurar cabeceras y cors (acceso)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, HEAD'
  );
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(
  cookieSession({
    // maxAge: 24 * 60 * 60 * 1000, // 24 hrs
    maxAge: 30000, // 24 hrs
    keys: [process.env.COOKIE_KEY]
  })
);

// body-parser config application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Config BD
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Importar rutas
var usuarios = require('./routes/usuarios.route');
var contratos = require('./routes/contratos.route');
var uds = require('./routes/uds.route');
var respBeneficiarios = require('./routes/respBeneficiarios.route');
var beneficiarios = require('./routes/beneficiarios.route');
var login = require('./routes/login.route');
var buscador = require('./routes/buscador.route');
var reportes = require('./routes/reportes.route');
var archivos = require('./routes/archivos.route');
var madres = require('./routes/madres.route');
var padres = require('./routes/padres.route');

// Conexión BD
mongoose.connect(
  process.env.DB_URI_LOCAL,
  { useNewUrlParser: true },
  (error, resp) => {
    if (error) throw error;
    console.log(
      '\x1b[32m%s\x1b[0m \x1b[33m%s\x1b[0m conectado',
      'MongoDB online',
      '[Proyecto-VRIC]'
    );
  }
);

// Rutas
app.use('/', usuarios);
app.use('/', contratos);
app.use('/', uds);
app.use('/', respBeneficiarios);
app.use('/', beneficiarios);
app.use('/', login);
app.use('/', buscador);
app.use('/', reportes);
app.use('/', archivos);
app.use('/', madres);
app.use('/', padres);

// Escuchar peticiones
app.listen(puerto, () => {
  console.log(
    `\x1b[32m%s\x1b[0m en: http://localhost:${puerto}/`,
    'Express server iniciado'
  );
});
