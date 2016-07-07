var userModel = require('../models/user').user;
var _CONFIG = require(__dirname + '/../../config/config');

//用户列表页
exports.list = function(req, res) {
    userModel.fetch(function(err, list) {
            if (err) {
                console.log(err)
            }
            var data = { list: list, oss_url: _CONFIG.upload.oss_url };
            res.render('./userMange/list', {
                    title: '用户列表页',
                    data: data
            })
    })
}
//编辑页面
exports.edit = function(req, res) {
        var id = req.params.id || '';
        if (id != 'undefined' && id != '' && id != null) {
            userModel.findById(id, function(err, row) {
                if (err) {
                    console.log(err);
                }
                res.render('./userMange/edit', {
                    title: "编辑用户【" + row.name + '】',
                    row: row
                });
            })
        }
    }
    //编辑页面
exports.add = function(req, res) {
    res.render('./userMange/edit', {
        title: '新增用户',
        row: {
            phone: '',
            name: '',
            email: '',
            sex: '',
            birth_day: '',
            header_pic_local: '',
        }
    });
}

//执行更新用户
exports.update = function(req, res) {
    var id = req.body._id || '';
    var post = req.body.user || '';
    if (id != 'undefined' && id != '' && id != null && post != '') {
        var newData = {
            name: post.name,
            email: post.email,
            sex: post.sex,
            birth_day: post.birth_day
        }
        if (post.new_header_pic) {
            newData.header_pic_local = post.new_header_pic;
        }
        userModel.updateField({ _id: id }, newData, function(err, row) {
            if (err) { console.log(err); }
            console.log(row);
            res.redirect('/');
        })
    } else if (post != '') { //新增用户
        var newData = {
            name: post.name,
            phone: post.phone,
            passwd: post.passwd,
            email: post.email,
            sex: post.sex,
            birth_day: post.birth_day,
            header_pic_local: post.new_header_pic,
        }
        new userModel(newData).save(function(err, row) {
            if (err) { console.log(err); }
            console.log(row);
            res.redirect('/');
        })
    }
}

//执行删除操作
exports.del = function(req, res) {
    var id = req.params.id;
    userModel.remove({ _id: id }, function(err, row) {
        if (err) {
            console.log('delete fail!');
        } else {
            console.log('delete ----' + row);
            res.redirect('/');
        }
    });
}
