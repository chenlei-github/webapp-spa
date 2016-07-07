var mongoose = require('mongoose');
var schema = require('../schemas/gupiao').schema;
var model = mongoose.model('gupiao',schema);
exports.model = model;