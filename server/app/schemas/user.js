var mongoose = require('mongoose');
var crypto = require('crypto');
var _CONFIG = require(__dirname+'/../../config/config');

var schema = new mongoose.Schema({
    phone: {
        unique: true,
        type: String
    },
    name:String,
    passwd:String,
    email:String,
    sex:Number,
    birth_day:String,
    header_pic_local:String,
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
    //用户密码加密
    this.passwd = crypto.createHash("md5").update(this.passwd).digest("hex");
    next();
});
schema.statics = {
    fetch: function(cb) {
        return this.find().sort('meta.updatetime').exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({ _id: id }).exec(cb);
    },
    findByPhone: function(phone, cb) {
        return this.findOne({ phone: phone }).exec(cb);
    },
    updateField: function(map,field, cb) {
        return this.findOneAndUpdate(map,field).exec(cb);
    },
}
exports.schema = schema;
