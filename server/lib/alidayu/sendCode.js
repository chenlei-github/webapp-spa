var _CONFIG = require('../../config/config'),
TopClient = require('./topClient').TopClient;
module.exports = function(phone, code) {
    var client = new TopClient(_CONFIG.alidayu);

    client.execute('alibaba.aliqin.fc.sms.num.send', {
        'extend': '123456',
        'sms_type': 'normal',
        'sms_free_sign_name': '测试',
        'sms_param': '{\"code\":\"' + code + '\",\"product\":\"登入注册\"}',
        'rec_num': phone,
        'sms_template_code': 'SMS_10636412'
    }, function(error, response) {
        if(error){
            console.log(error);
        }
        return error ? false : true;
    })
}
