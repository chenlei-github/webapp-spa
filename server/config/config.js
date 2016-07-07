//阿里大鱼短信配置
var alidayu = {
    appkey: '',
    appsecret: '',
    REST_URL: 'http://gw.api.taobao.com/router/rest',
}


//阿里云OSS相关配置
var aliyunOSS = {
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: 'http://oss-cn-beijing.aliyuncs.com',
    apiVersion: '2013-10-15', //oss sdk 目前支持最新api 版本[默认无需修改]
    bucket: '',
}


//文件上传相关配置
var upload = {
  dir: __dirname+'/../public/upload/pic/',
  oss_url: 'http://'+aliyunOSS.bucket+'.'+aliyunOSS.endpoint.slice(aliyunOSS.endpoint.indexOf('://')+3)+'/',
}

//百度apistore
var baidu = {
    apikey : ""
}


exports.alidayu = alidayu;
exports.aliyunOSS = aliyunOSS;
exports.upload = upload;
exports.baidu = baidu;