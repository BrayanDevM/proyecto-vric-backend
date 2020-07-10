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

var respBeneficiarioSchema = new Schema({
  tipoDoc: {
    type: String,
    required: [true, 'Tipo de documento es obligatorio'],
    enum: docValidacion
  },
  documento: {
    type: String,
    required: [true, 'Nombre de UDS es obligatorio'],
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
    required: [true, 'Nombre de UDS es obligatorio'],
    enum: sexoValidacion
  },
  paisNacimiento: {
    type: String,
    required: [true, 'Pais de nacimiento es obligatorio']
  },
  dptoNacimiento: {
    type: String,
    required: [true, 'Departamento de nacimiento es obligatorio']
  },
  municipioNacimiento: {
    type: String,
    required: [true, 'Municipio de nacimiento es obligatorio']
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: undefined
  },
  creadoEl: { type: String, required: false, default: '08/05/2020' }
});
respBeneficiarioSchema.plugin(uniqueValidator, {
  message: 'Ya existe un registro con el valor {VALUE}'
});

module.exports = mongoose.model(
  'respBeneficiario',
  respBeneficiarioSchema,
  'respBeneficiarios' // Indico la colección ya que tiene camelCase
);
