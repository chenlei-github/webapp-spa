var commentModel = require('../models/comment').comment;
var _FUNCTION = require('../../lib/function');
var _CONFIG = require(__dirname + '/../../config/config');


exports.add = function(req, res) {
    var _user = req.session.user || '';
    if (!_user) {
        console.log('请登入');
        res.jsonp({ status: 0, code: 0, msg: '请登录后再评论！' });
        return;
    }
    var commentData = req.query.row;
    commentData.from = _user._id;

    if (commentData.tid && commentData.cid) {

        if (commentData.tid == _user._id) { //不能回复自己
            res.jsonp({ status: 0, code: 1, msg: '你4不4傻？自己回复自己？' });
            return;
        }

        commentModel.findById(commentData.cid, function(err, comment) {
            var reply = {
                from: _user._id,
                to: commentData.tid,
                content: commentData.content
            }
            if (!comment) {
                res.jsonp({ status: 0, code: 2, msg: '暂不支持楼中楼功能！' });
                return;
            }

            comment.reply.push(reply);

            commentModel.updateField({ _id: comment._id }, comment, function(err, row) {
                if (err) {
                    res.jsonp({ status: 0, code: 3, msg: '矮油，回复失败了哦~' });
                    return;
                }
                res.jsonp({ status: 1, code: 200, msg: '回复成功！' });
                return;
            })
        })
    } else {
        new commentModel(commentData).save(function(err, row) {
            if (err) { console.log(err); }
            res.jsonp({ status: 1, code: 200, msg: '评论成功！' });
            return;
        })
    }


}


exports.list = function(req, res) {
    var shop = req.query.shop || '';
    if (shop == '') {
        res.jsonp({ status: 0, code: 0, msg: '商品id为空' });
        return;
    }
    commentModel.find({ shop: shop })
        .populate({ path: 'from', select: 'name header_pic_local' })
        .populate('reply.from reply.to', 'name header_pic_local')
        .exec(function(err, list) {
            if (err) { console.log(err); }
            res.jsonp({ status: 1, code: 200, msg: '数据获取成功', data: { list: list, oss_url: _CONFIG.upload.oss_url } });
            return;
        })
}
