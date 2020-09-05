var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

docValidacion = {
  values: ['RC', 'TI', 'CC', 'CE', 'PEP', 'SD'],
  message: '{VALUE} no es un tipo de documento permitido'
};

sexoValidacion = {
  values: ['Mujer', 'Hombre', 'Intersex', 'Otro'],
  message: '{VALUE} no es un tipo de sexo permitido'
};

estadoValidacion = {
  values: [
    'Pendiente vincular',
    'Pendiente desvincular',
    'Dato sensible',
    'Vinculado',
    'Desvinculado',
    'Concurrencia'
  ],
  message: '{VALUE} no es un tipo de estado permitido'
};

reconocimientoValidacion = {
  values: [
    'Afrocolombiano',
    'Comunidad negra',
    'Indigena',
    'Palenquero',
    'RROM/Gitano',
    'Raizal archipielago San Andrés',
    'Ninguno'
  ],
  message: '{VALUE} no es un tipo de autorreconocimiento permitido'
};

tipoResponsableValidacion = {
  values: [
    'Madre',
    'Padre',
    'Tia/o',
    'Abuela/o',
    'Conyugue',
    'Si misma',
    'Otro'
  ],
  message: '{VALUE} no es un tipo de responsable permitido'
};

motivosEgreso = {
  values: [
    'Retiro voluntario del programa',
    'Tránsito a otro programa',
    'Traslado de municipio',
    'Cambio de grupo familiar',
    'Distancia del centro de atención',
    'Edad cumplida',
    'Enfermedad',
    'Fallecimiento',
    'No le gusta la comida',
    'En casa hay quien lo cuide',
    'Alto costo para la familia (transporte)',
    'Cambio vigencia',
    'Conflicto armado',
    'Desplazamiento forzado',
    'Pasó al SIMAT',
    'Otro'
  ],
  message: '{VALUE} no es un motivo de egreso permitido'
};

var beneficiariosSchema = new Schema({
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
  nombre2: { type: String, required: false },
  apellido1: {
    type: String,
    required: [true, 'Primer apellido es obligatorio']
  },
  apellido2: { type: String, required: false },
  sexo: {
    type: String,
    required: [true, 'Nombre de UDS es obligatorio'],
    enum: sexoValidacion
  },
  nacimiento: {
    type: String,
    required: [true, 'Fecha de nacimiento es obligatoria']
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
  discapacidad: {
    type: Boolean,
    required: false,
    default: false
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    default: ''
  },
  barrio: {
    type: String,
    default: ''
  },
  telefono: {
    type: String,
    required: [true, 'El telefono es obligatoria'],
    default: ''
  },
  autorreconocimiento: {
    type: String,
    required: [true, 'Autorreconocimiento es obligatorio'],
    enum: reconocimientoValidacion
  },
  criterio: {
    type: String,
    required: false,
    default: ''
  },
  infoCriterio: {
    type: String,
    required: false,
    default: ''
  },
  ingreso: {
    type: String,
    required: [true, 'La fecha de ingreso es obligatoria']
  },
  tipoResponsable: {
    type: String,
    required: [true, 'Tipo de responsable es obligatorio'],
    enum: tipoResponsableValidacion
  },
  responsableId: {
    type: Schema.Types.ObjectId,
    ref: 'respBeneficiario',
    required: true
  },
  padreId: {
    type: Schema.Types.ObjectId,
    ref: 'padres',
    required: false,
    default: null
  },
  madreId: {
    type: Schema.Types.ObjectId,
    ref: 'madres',
    required: false,
    default: null
  },
  estado: {
    type: String,
    required: true,
    default: 'Pendiente vincular',
    enum: estadoValidacion
  },
  uds: {
    type: Schema.Types.ObjectId,
    ref: 'Uds',
    required: [true, 'Debe asignar una Unidad de servicio']
  },
  egreso: {
    type: String,
    required: false,
    default: ''
  },
  motivoEgreso: {
    type: String,
    required: false,
    default: ''
  },
  infoDiscapacidad: {
    type: String,
    default: ''
  },
  comentario: {
    type: String,
    required: false,
    default: ''
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  creadoEl: { type: String, required: false, default: '08/05/2020' }
});
beneficiariosSchema.plugin(uniqueValidator, {
  message: 'Ya existe un registro con el valor {VALUE}'
});

module.exports = mongoose.model('Beneficiario', beneficiariosSchema);
