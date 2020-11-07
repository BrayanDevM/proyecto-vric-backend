var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configSchema = new Schema({
  frontend_version: {
    type: String,
    default: '1.0.0',
  },
  backend_version: {
    type: String,
    default: '2.0.0',
  },
});
module.exports = mongoose.model('Config', configSchema, 'config');
