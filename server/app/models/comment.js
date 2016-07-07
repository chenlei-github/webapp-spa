var mongoose = require('mongoose');
var commentSchema = require('../schemas/comment');
var comment = mongoose.model('comment',commentSchema);
exports.comment = comment;