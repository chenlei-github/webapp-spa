module.exports = function(app) {
    var common = require('../app/controllers/common');
    var user = require('../app/controllers/user');
    var shop = require('../app/controllers/shop');
    var userMange = require('../app/controllers/userMange');
    var comment = require('../app/controllers/comment');
    var weather = require('../app/controllers/weather');
    var gupiao = require('../app/controllers/gupiao');
    var train = require('../app/controllers/train');
    var _CONFIG = require('./config');

    app.use(function(req, res, next) {
        var _userSession = req.session.user || '';
        if (_userSession != '') {
            app.locals.user = _userSession;
        }
        app.locals.oss_url = _CONFIG.upload.oss_url ? _CONFIG.upload.oss_url : '';
        next();
    })
    //设置跨域访问
    app.all('/user/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });
    //客户端数据接口
    app.get('/user/profile', user.profile); //获取登录用户信息
    app.get('/user/register', user.register); //执行用户注册
    app.get('/user/login', user.login); //执行用户登入
    app.get('/user/getVerifyCode', user.getVerifyCode); //获取手机验证码
    app.get('/user/logout', user.logout); //用户登出
    app.post('/user/headerPicUpload', common.upload); //接收用户头像上传
    app.get('/user/updateProfile', user.updateProfile); //修改用户资料

    app.post('/user/shop', shop.list); //商品列表数据
    app.get('/user/shop/detail/:id', shop.detail); //商品详细页

    app.get('/user/comment', comment.add); //用户评论
    app.get('/user/comment/list', comment.list); //获取商品的所有用户评论

    app.get('/user/weather/getAddr', weather.getAddr); //获取天气查询地址
    app.get('/user/weather/getWeekWeather', weather.getWeekWeather); //获取一周天气
    app.get('/user/weather/getDayWeather', weather.getDayWeather); //获取当天天气

    app.get('/user/gupiao/getInfo', gupiao.getInfo); //获取股票名称信息代码
    app.get('/user/gupiao/getDetail', gupiao.getDetail); //获取股票名称信息代码

    app.get('/user/train/getTickets', train.getTickets); //获取火车票票务信息


    //用户管理
    app.get('/', userMange.list); //用户列表
    app.get('/userMange/del/:id', userMange.del); //删除用户
    app.get('/userMange/add', userMange.add); //新增用户
    app.get('/userMange/edit/:id', userMange.edit); //编辑用户数据
    app.post('/userMange/update', userMange.update); //执行用户数据修改
    app.post('/upload', common.upload); //公用图像上传
    //商品管理
    app.get('/shop/pic/:id/:title', shop.piclist);
    app.get('/shop', shop.list);
    app.get('/shop/del/:id', shop.del);
    app.get('/shop/add', shop.add);
    app.get('/shop/edit/:id', shop.edit);
    app.post('/shop/update', shop.update);
    app.get('/shop/addpic/:id', shop.addpic);
    app.get('/shop/piclist', shop.piclist);



}
