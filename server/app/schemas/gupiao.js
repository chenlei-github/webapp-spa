var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name:String,
    code:String,
    type:String,
})

exports.schema = schema;
