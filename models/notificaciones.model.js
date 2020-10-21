var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificacionesSchema = new Schema({
  creadaPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  fechaCreada: {
    type: String,
    required: [true, 'La fecha de creada es obligatoria']
  },
  titulo: {
    type: String,
    required: [true, 'Titulo es obligatorio']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  leidaPor: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      default: []
    }
  ],
  general: {
    type: Boolean,
    default: false
  },
  paraUsuarios: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      default: []
    }
  ]
});

module.exports = mongoose.model('Notificaciones', notificacionesSchema);
