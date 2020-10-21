var mongoose = require('mongoose');
var Schema = mongoose.Schema;

tipoValidacion = {
  values: ['Fallo', 'Sugerencia', 'Mensaje'],
  message: '{VALUE} no es un tipo de reporte permitido'
};

var reportesSchema = new Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo de reporte es obligatorio'],
    enum: tipoValidacion
  },
  asunto: {
    type: String,
    required: [true, 'El asunto es obligatorio']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  completado: {
    type: Boolean,
    default: false
  },
  creadoEl: {
    type: String,
    required: [true, 'La fecha del reporte es obligatoria']
  },
  reportadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario que reporta es obligatorio']
  }
});

module.exports = mongoose.model('Reporte', reportesSchema);
