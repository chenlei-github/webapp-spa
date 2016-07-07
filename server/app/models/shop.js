var mongoose = require('mongoose');
var shopSchema = require('../schemas/shop').schema;
var model = mongoose.model('shop',shopSchema);
exports.model = model;