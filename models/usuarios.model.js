var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var roleValidacion = {
  values: ['ADMIN', 'DOCENTE', 'GESTOR', 'COORDINADOR'], // debe ser values
  message: '{VALUE} no es un rol permitido' // debe ser messages
};

var usuarioSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
  documento: {
    type: Number,
    unique: true,
    required: [true, 'El documento es obligatorio']
  },
  correo: {
    type: String,
    unique: true,
    required: [true, 'El correo es obligatorio']
  },
  rol: {
    type: String,
    required: true,
    default: 'DOCENTE',
    enum: roleValidacion
  },
  img: { type: String, required: false, default: '' },
  telefono: { type: String, required: false, default: '' },
  contratos: { type: Array, default: [], required: false },
  uds: [
    { type: Schema.Types.ObjectId, ref: 'Uds', default: [], required: false }
  ],
  creadoEl: { type: String, default: '08/05/2020', required: false },
  google: { type: Boolean, required: true, default: false },
  activo: { type: Boolean, required: false, default: true },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  }
});
usuarioSchema.plugin(uniqueValidator, {
  message: 'Ya existe un registro con el valor {VALUE}'
});

module.exports = mongoose.model('Usuario', usuarioSchema);
