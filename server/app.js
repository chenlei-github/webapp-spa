var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongo = require('mongoose');
var mongoStore = require('connect-mongo')(express);

var port = process.env.PORT || 3000;
var app = express();

var dbUrl = 'mongodb://localhost/shop_chenlei';
mongo.connect(dbUrl);

//视图相关
app.set('views', './app/views');
app.set('view engine', 'jade');
//session相关
app.use(express.cookieParser());
app.use(express.session({
    secret: 'myshop',
    store:   new mongoStore({
    	url:dbUrl,
    	collection:'sessions'
    })
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.favicon());
//设置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
//开启调试信息
app.locals.pretty = true;
app.use(express.logger(':url :method :status'));
app.set('showStackError',true);
mongo.set('debug',true);

app.listen(port);

require('./config/routes')(app);

console.log('server on '+port);