var superagent = require('superagent'),
    cheerio = require('cheerio'),
    url = require('url');

//获取今日天气数据信息
var getDayWeather = function(req, res) {
    var id = req.query.id || '',
    url = "http://d1.weather.com.cn/sk_2d/" + id + ".html",
    refer = 'http://www.weather.com.cn/weather1d/' + id + '.shtml',
    host = 'd1.weather.com.cn',
    agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0',
    resData = {};

    superagent.get(url).set('Host', host).set('Referer', refer).set('User-Agent', agent).end(function(err, results) {
        if (err) {
            console.log('错误:' + err);
            resData = {status:1,data:'',msg:'返回数据失败'}
        } else {
            eval(results.text);
            resData = {status:200,data:dataSK,msg:'返回数据成功'}
        }
        res.jsonp(resData);
    });
}

//获取七天内天气数据
var getWeekWeather = function(req, res) {
    var id = req.query.id || '',
    url = 'http://baidu.weather.com.cn/mweather/' + id + '.shtml',
    host = 'baidu.weather.com.cn',
    refer = 'http://baidu.weather.com.cn/manage/citmani.html',
    agnet = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0';

    superagent.get(url).set('Host', host).set('Referer', refer).set('User-Agent', agnet)
    .end(function(err, results) {
        var data =  { status: 0, data: [], msg: '返回数据失败' };
        try {//尝试解析返回数据
            var html = results.text || '',
            $ = cheerio.load(html);
            $(".days7 ul").find("li").each(function(i, e) {
                var row = { time:$(e).children("b").text(), icon: $(e).children("i").html(), temp:$(e).children("span").text() };
                data.data.push(row);
            })
            data.status = 200;
            data.msg = '数据返回成功！';

        } catch (e) {
            console.log('抓取数据错误：'+url+e);
        }
        res.jsonp(data);
    });
}

//获取中国气象局支持天气查询的所有地区
var getAddr = function(req, res) {
    var provshi = req.query.provshi || '',
        station = req.query.station || '',
        data = { status: 0, data: '', msg: '参数为空' },
        _url = "http://www.weather.com.cn/data/city3jdata/";
    if (provshi == '' && station == '') {
        res.jsonp(data);
        return;
    }
    var val = provshi == '' ? station : provshi,
        url = _url + (provshi == '' ? 'station/' : 'provshi/') + val + '.html';
    console.log('抓取地址：' + url);
    superagent.get(url)
        .set('Accept', 'application/json')
        .set('Host', 'www.weather.com.cn')
        .set('Referer', 'http://www.weather.com.cn/pubmodel/inquires2.htm')
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0')
        .end(function(err, results) {
            try {
                console.log('成功返回数据：' + JSON.parse(results.text));
                data.status = 200;
                data.msg = '数据返回成功！';
                data.list = JSON.parse(results.text);
            } catch (e) {
                data.status = 1;
                data.msg = '返回数据失败~';
            }
            res.jsonp(data);
            return;
        });
}

exports.getAddr = getAddr;
exports.getWeekWeather = getWeekWeather;
exports.getDayWeather = getDayWeather;
