var https = require('https');

exports.getTickets = function(req, res) {
    var date = req.query.date || '',
        from = req.query.from || '',
        to = req.query.to || '',
        path = '/otn/leftTicket/query?leftTicketDTO.train_date='+date+'&leftTicketDTO.from_station='+from+'&leftTicketDTO.to_station='+to+'&purpose_codes=ADULT',
        options = { hostname: 'kyfw.12306.cn', port: 443, path: path, method: 'GET', rejectUnauthorized: false },
        data = { status: 0, code: 0, data: '', msg: '暂无数据...' };

    if (date == '' || from == '' || to == '') {
        res.jsonp(data);
        return;
    }

    var request = https.request(options, function(response) {
        var chunks = [],
            size = 0;
        response.on('data', function(data) {
            chunks.push(data);
            size += data.length;
        });
        response.on("end", function() {
            var result = Buffer.concat(chunks, size).toString();
            data = { status: 1, code: 200, data: result, msg: '请求成功' };
            console.log(data);
            res.jsonp(data);
        });
    }).on("error", function(err) {
        console.log('错误：' + err);
    });
    request.end();
}
