var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

docValidacion = {
  values: ['RC', 'TI', 'CC', 'CE', 'PEP', 'PA', 'CE', 'SD'],
  message: '{VALUE} no es un tipo de documento permitido'
};

sexoValidacion = {
  values: ['Mujer', 'Hombre', 'Intersex', 'Otro'],
  message: '{VALUE} no es un tipo de sexo permitido'
};

var madresSchema = new Schema({
  tipoDoc: {
    type: String,
    required: [true, 'Tipo de documento es obligatorio'],
    enum: docValidacion
  },
  documento: {
    type: String,
    required: [true, 'Número de documento es obligatorio'],
    unique: true
  },
  nombre1: { type: String, required: [true, 'Primer nombre es obligatorio'] },
  nombre2: { type: String },
  apellido1: {
    type: String,
    required: [true, 'Primer apellido es obligatorio']
  },
  apellido2: { type: String },
  nacimiento: {
    type: String,
    required: [true, 'Fecha de nacimiento es obligatoria']
  },
  sexo: {
    type: String,
    required: [true, 'Sexo es obligatorio'],
    enum: sexoValidacion
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: undefined
  },
  creadoEl: { type: String, required: false, default: '08/05/2020' }
});
madresSchema.plugin(uniqueValidator, {
  message: 'Ya existe un registro con el valor {VALUE}'
});

module.exports = mongoose.model('madres', madresSchema);
