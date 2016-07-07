var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OBJ_ID = Schema.Types.ObjectId;
var _CONFIG = require(__dirname+'/../../config/config');

var schema = new mongoose.Schema({
    title:String,
    price:Number,
    before_price:Number,
    img:String,
    oss_img:String,
    meta: {
        createtime: {
            type: Date,
            default: Date.now()
        },
        updatetime: {
            type: Date,
            default: Date.now()
        },
    }
})

//保存前用户数据处理
schema.pre('save', function(next) {
    this.meta.updatetime = Date.now();
    if (this.isNew) {
        this.meta.createtime = Date.now();
    }
    next();
});
schema.statics = {
    fetch: function(cb) {
        return this.find().sort({'meta.createtime':-1}).exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({ _id: id }).exec(cb);
    },
    updateField: function(map,field, cb) {
        return this.findOneAndUpdate(map,field).exec(cb);
    },
}
exports.schema = schema;
