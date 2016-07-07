var mongoose = require('mongoose');
var userSchema = require('../schemas/user').schema;
var user = mongoose.model('user',userSchema);
exports.user = user;