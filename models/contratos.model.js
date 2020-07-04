var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var contratoSchema = new Schema({
  codigo: {
    type: Number,
    unique: true,
    required: [true, 'El código de contrato es obligatorio']
  },
  regional: {
    type: String,
    required: [true, 'Nombre de regional es obligatorio']
  },
  cz: {
    type: String,
    required: [true, 'El Centro Zonal (cz) es obligatorio']
  },
  cupos: {
    type: Number,
    required: false,
    default: 0
  },
  eas: { type: String, required: true, default: '' },
  nit: { type: String, required: true, default: '' },
  creadoEl: { type: String, required: false, default: '08/05/2020' },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  uds: [{ type: Schema.Types.ObjectId, ref: 'Uds', default: [] }],
  activo: {
    type: Boolean,
    required: false,
    default: false
  }
});
contratoSchema.plugin(uniqueValidator, {
  message: 'Ya existe un registro con el valor {VALUE}'
});

module.exports = mongoose.model('Contrato', contratoSchema);
