var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var udsSchema = new Schema({
  codigo: {
    type: Number,
    unique: true,
    required: [true, 'El código de UDS es obligatorio']
  },
  nombre: {
    type: String,
    required: [true, 'Nombre de UDS es obligatorio']
  },
  cupos: {
    type: Number,
    required: false,
    default: 0
  },
  beneficiarios: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Beneficiario',
      required: false,
      default: []
    }
  ],
  arriendo: { type: Boolean, required: false, default: false },
  coordinador: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false,
    default: null
  },
  docentes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false
    }
  ],
  gestor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false,
    default: null
  },
  ubicacion: { type: String, required: true, default: '' },
  enContrato: {
    type: Schema.Types.ObjectId,
    ref: 'Contrato',
    default: null
  },
  creadoEl: { type: String, required: false, default: '08/05/2020' },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Debes indicar el _id de quien crea la UDS']
  },
  activa: {
    type: Boolean,
    required: false,
    default: false
  },
  latitud: {
    type: String,
    default: ''
  },
  longitud: {
    type: String,
    default: ''
  }
});
udsSchema.plugin(uniqueValidator, {
  message: 'Ya existe un registro con el valor {VALUE}'
});

module.exports = mongoose.model('Uds', udsSchema);
