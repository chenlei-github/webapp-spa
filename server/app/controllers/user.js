var userModel = require('../models/user').user;
var _FUNCTION = require('../../lib/function');
var _CONFIG = require(__dirname+'/../../config/config');
var sendCode = require('../../lib/alidayu/sendCode');
var crypto = require('crypto');
var fs = require("fs");



exports.profile = function(req, res) {
    var _user = req.session.user || '';
    if (!_user) {
        console.log('请登入');
        res.jsonp({ status: 0, code: '1', msg: '请登入' });
        return;
    }
    var map = { phone: _user.phone }
    userModel.findOne(map, function(err, user) {
        if (err) {
            console.log(err);
            res.jsonp({ status: 0, code: '2', msg: err });
            return;
        }
        var userInfo = {
            phone: user.phone,
            name: user.name || '',
            email: user.email || '',
            sex: user.sex || 0,
            birth_day: user.birth_day || '',
            header_pic_local: user.header_pic_local || '',
            header_pic_oss: user.header_pic_local ==''?'':_CONFIG.upload.oss_url+user.header_pic_local
        };
        req.session.user = user;
        res.jsonp({ status: 1, code: '200', msg: '获取用户信息成功', data: userInfo });
    })
}



exports.updateProfile = function(req, res) {
    var _user = req.session.user || '';
    if (!_user) {
        console.log('请登入');
        res.jsonp({ status: 0, code: '1', msg: '请登入' });
        return;
    }
    var postData = req.query.user || '';
    var userData = {
        email: postData.email || '',
        sex: postData.sex || 0,
        birth_day: postData.birth_day || '',
    }
    if(postData.header_pic){
        userData.header_pic_local = postData.header_pic;
    }
    userModel.updateField({ _id: _user._id }, userData, function(err, row) {
        if (err) {
            console.log('用户资料修改失败' + err);
            res.jsonp({ status: 0, code: 1, msg: '用户资料修改失败' + err });
            return;
        } else {
            res.jsonp({ status: 1, code: 200, msg: '修改成功' });
            return;
        }
    })
}

exports.upload = function(req, res) {
    res.render('upload', {});
}

//用户注册模块
exports.register = function(req, res) {
    //表单验证
    var _user = req.query.user;

    if (_user.phone == '' || _user.passwd == '' || _user.yzm == '') {
        res.jsonp({ status: 0, code: 2, msg: '注册信息不完整！' });
        return;
    }
    //是否重复注册
    var map = { phone: _user.phone }
    userModel.findOne(map, function(err, hasUser) {
        if (err) {
            console.log(err);
            res.jsonp({ status: 0, code: '-1', msg: err });
            return;
        }
        if (hasUser) {
            console.log('手机号重复，注册失败...');
            res.jsonp({ status: 0, code: 3, msg: '该手机号已注册，请直接登录' });
            return;
        }
        //手机验证码是否正确
        var code = req.session.userVerifyCode || '';
        if (code == '' || code != _user.yzm) {
            res.jsonp({ status: 0, code: 4, msg: '验证码不正确或已失效！' });
            return;
        }
        //用户注册数据入库
        new userModel(_user).save(function(err, user) {
            if (err) {
                console.log(err);
                res.jsonp({ status: 0, code: '-1', msg: err });
                return;
            }
            console.log('\n注册成功:' + user);
            delete req.session.userVerifyCode; //验证后清空
            res.jsonp({ status: 1, code: 1, msg: '注册成功！' });
            return;
        })
    })

}

//发送验证码
exports.getVerifyCode = function(req, res) {
    var phone = req.query.phone || '';
    if (phone == '') {
        res.jsonp({ status: 0, code: 2, msg: '手机号不能为空！' });
        return;
    }
    var code = _FUNCTION.getRandomN(4);
    sendCode(phone, code);
    var resData = {};
    if (1) {
        req.session.userVerifyCode = code;
        resData = { status: 1, code: 1, msg: '验证码发送成功！' };
    } else {
        resData = { status: 0, code: 0, msg: '短信发送失败！' };
    }
    console.log('手机号：' + phone + ' 验证码：' + code);
    res.jsonp(resData);
}



//用户登入
exports.login = function(req, res) {
    console.log('session端验证码：' + req.session.userVerifyCode);
    var _user = req.query.user;
    if (_user.phone == '' || typeof(_user.phone) == 'undefined') {
        res.jsonp({ status: 0, code: 2, msg: '手机号不能为空！' });
        return;
    }
    var type = req.query.login_type;
    if (_user.passwd == '' || typeof(_user.passwd) == 'undefined') {
        var tips = type == 1 ? '用户密码不能为空！' : '手机验证码不能为空！';
        res.jsonp({ status: 0, code: 2, msg: tips });
        return;
    }
    //是否存在用户
    var map = { phone: _user.phone }
    userModel.findOne(map, function(err, user) {
        if (err) {
            console.log(err);
            res.jsonp({ status: 0, code: '-1', msg: err });
            return;
        }
        if (!user) {
            console.log('手机号不存在...');
            res.jsonp({ status: 0, code: 3, msg: '该手机号码未注册！' });
            return;
        }
        //根据登录方式做相关验证
        switch (parseInt(type)) {
            case 1: //用户密码验证
                if (user.passwd != crypto.createHash("md5").update(_user.passwd).digest("hex")) {
                    res.jsonp({ status: 0, code: 4, msg: '用户密码错误！' });
                    return;
                }
                break;

            case 2: //验证码验证
                var code = req.session.userVerifyCode || '';
                if (code == '' || code != _user.passwd) {
                    res.jsonp({ status: 0, code: 4, msg: '验证码不正确或已失效！' });
                    return;
                }
                break;
            default:
                res.jsonp({ status: 0, code: 5, msg: '非法请求' });
                return;

        }
        delete req.session.userVerifyCode;
        req.session.user = user;
        var userInfo = {
            phone: user.phone,
            name: user.name || '',
            email: user.email || '',
            sex: user.sex || 0,
            birth_day: user.birth_day || '',
            header_pic_local: user.header_pic_oss || '',
            header_pic_oss: user.header_pic_oss || ''
        };

        res.jsonp({ status: 1, code: 1, msg: '登录成功', data: userInfo });
    })

}

exports.logout = function(req, res) {
    delete req.session.user;
    res.jsonp({ status: 1, code: 200, msg: '注销成功！' });
    return;
}

exports.signinRequired = function(req, res, next) {
    var user = req.session.user
    if (!user) {
        res.json({ status: 0, code: 0, msg: '请登录！', data: '' });
        return;
    }
    next()
}
