var shopModel = require('../models/shop').model;
var _FUNCTION = require('../../lib/function');
var _CONFIG = require(__dirname + '/../../config/config');

var fs = require("fs");
var _ = require('underscore');
//商品列表页
exports.list = function(req, res) {
    shopModel.fetch(function(err, list) {
        if (err) {
            console.log(err);
            return;
        }
        var data = { list: list, oss_url: _CONFIG.upload.oss_url };
        if (req.method == 'POST') {
            res.jsonp({ status: 1, code: 200, msg: '数据获取成功', data: data });
            return;
        } else {
            res.render('./shop/list', {
                title: '商品列表页',
                data: data
            })
        }
    })
}



//商品编辑页面
exports.edit = function(req, res) {
        var id = req.params.id || req.body.id || '';
        if (id != 'undefined' && id != '' && id != null) {
            shopModel.findById(id, function(err, row) {
                if (err) { console.log(err); }
                res.render('./shop/edit', {
                    title: "编辑商品【" + row.title + '】',
                    row: row
                });

            })
        }
    }
//商品详细页
exports.detail = function(req, res) {
    var id = req.params.id || '';
    if (id != 'undefined' && id != '' && id != null) {
        shopModel.findById(id, function(err, row) {
            if (err) { console.log(err); }
            res.jsonp({ status: 1, code: 200, msg: '数据获取成功', data: {row:row,oss_url:_CONFIG.upload.oss_url} });
            return;
        })
    }
}

//新增商品页面
exports.add = function(req, res) {
        res.render('./shop/edit', {
            title: '商品新增',
            row: {
                title: '',
                price: '',
                before_price: '',
            }
        });
    }
    //新增图片
exports.addpic = function(req, res) {
        // var id = req.query.id || '';
        // if(!id){
        //     res.redirect('/shop');
        //     return;
        // }
        res.render('./shop/addpic', {
            title: '商品图片新增',
            //row: {id: id}
        });
    }
    //商品图列表页
exports.piclist = function(req, res) {
    var id = req.query.id || '';
    var title = req.query.title || '';
    if (id == '' || title == '') {
        res.redirect('/shop');
        return;
    }
    res.render('./shop/piclist', {
        title: '【' + title + '】商品图列表',
        row: { id: id }
    });
}


//执行更新商品
exports.update = function(req, res) {
    var id = req.body._id || '';
    var post = req.body.row || '';
    if (id != 'undefined' && id != '' && id != null && post != '') {
        var newData = {
            title: post.title,
            price: post.price,
            before_price: post.before_price,
        }
        if (post.img) { //是否上传商品图
            newData.img = post.img;
        }
        shopModel.updateField({ _id: id }, newData, function(err, row) {
            if (err) { console.log(err); }
            console.log(row);
            res.redirect('/shop');
        })
    } else if (post != '') { //新增
        new shopModel(post).save(function(err, row) {
            if (err) { console.log(err); }
            console.log(row);
            res.redirect('/shop');
        })
    }
}

//执行删除操作
exports.del = function(req, res) {
    var id = req.params.id;
    shopModel.remove({ _id: id }, function(err, row) {
        if (err) {
            console.log('delete fail!');
        } else {
            console.log('delete ----' + row);
            res.redirect('/shop');
        }
    });
}
