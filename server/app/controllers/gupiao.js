var gupiaoModel = require('../models/gupiao').model,
superagent = require('superagent'),
_CONFIG = require('../../config/config');

//股票名称信息代码查询
exports.getInfo = function(req, res) {
    var keyword = req.query.keyword || '',
        data = { status: 0, code: 0, data: '', msg: '暂无数据...' };
    if (keyword == '') {
        res.jsonp(data);
        return;
    }
    var map = {$or:[
            { name: { $regex: '.*'+keyword+'.*', "$options": "i" } }, 
            { code: { $regex: '^'+keyword+'.*', "$options": "i" } }
        ]} 
    
    gupiaoModel.find({}).where(map).limit(15).exec(function(err, result) {
        if (err) {
            console.log('查询出错：' + err);
        } else {
           data = { status: 1, code: 200, data: result, msg: '查询成功' };
        }
        res.jsonp(data);
    });

}
//股票实时数据查询
 exports.getDetail = function(req, res) {
    var id = req.query.id || '',
    url = 'http://apis.baidu.com/apistore/stockservice/stock?stockid='+id,
    data = { status: 0, code: 0, data: '', msg: '暂无数据...' },
    key = _CONFIG.baidu.apikey;
    if (id == '') {
        res.jsonp(data);
        return;
    }
    superagent.get(url).set('apiKey', key).end(function(err, results) {
        data = { status: 1, code: 200, data: results.text, msg: '返回数据成功！' }
        console.log('股票数据：'+results.text);
        res.jsonp(data);
    })
}
