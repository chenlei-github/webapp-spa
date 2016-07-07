var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new mongoose.Schema({
  shop: {type: ObjectId, ref: 'shop'},
  from: {type: ObjectId, ref: 'user'},//主评论用户id
  reply: 
  [{
    from: {type: ObjectId, ref: 'user'},//回复人id
    to: {type: ObjectId, ref: 'user'},//被回复人id
    content: String,
    meta: {
      createAt: {type: Date,default: Date.now()},
      updateAt: {type: Date,default: Date.now()}
    }
  }],
  content: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// var ObjectId = mongoose.Schema.Types.ObjectId
CommentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

CommentSchema.statics = {
  fetch: function(shop_id,cb) {
    return this.find({shop:shop_id}).sort('meta.updateAt').exec(cb)
  },
  updateField: function(map,field, cb) {
      return this.findOneAndUpdate(map,field).exec(cb);
  },

}

module.exports = CommentSchema;