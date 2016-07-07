//搜索提示
$("#gupiao").on("keyup", "#gupiaoKeyWords", function() {
  $("#gupiao .search_tips ul").empty();
  $("#gupiaoResult").html('');
  $(".res_img").html('');
  gupiaoInfo($(this).val());
})

//点击获取加载股票实时数据
$(".search_tips").on("click", ".item-content", function() {
  $("#gupiao .search_tips ul").empty();
  var code = $(this).attr("data-code") || '',
    type = $(this).attr("data-type") || '',
    name = $(this).attr("data-name") || '',
    str = '股票名称:' + name + '    地区:' + (type == 'sz' ? '深圳' : '上海') + '    编号:' + code;
  $("#gupiaoKeyWords").val(str);
  getDetail(type + code);
})

//获取股票名称代号信息
var gupiaoInfo = function(keyword) {
  var keyword = $.trim(keyword) || '';
  if (keyword == '') return;
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: _HOST + "user/gupiao/getInfo",
    data: {
      keyword: keyword
    },
    success: function(res) {
      if (res.status != 1) return;
      var str = formatSearchTips(res.data);
      $("#gupiao .search_tips ul").html(str);
    }
  })
}


var getDetail = function(id) {
  if (id == '') return;
  var _url = _HOST + 'user/gupiao/getDetail';
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: _url,
    data: {
      id: id
    },
    success: function(res) {
      var data = JSON.parse(res.data);
      if (data.retData.stockinfo.name == 'FAILED') {
        $.alert('暂无该股票数据...');
        return;
      }
      formatGupiaoData(data.retData);
    }
  })
}

var formatGupiaoData = function(data) {
  var str = '',
    titleArr = ['股票名称', '今日开盘价', '昨日收盘价', '当前价格', '今日最高价', '今日最低价', '买一报价', '卖一报价'],
    titleEnArr = ['name', 'OpenningPrice', 'closingPrice', 'currentPrice', 'hPrice', 'lPrice', 'competitivePrice', 'auctionPrice'];
  $.each(titleArr, function(i, title) {
    str += '<div class="col-50">' + title + '：</div><div class="col-50">' + data['stockinfo'][titleEnArr[i]] + '</div>';
  })
  $("#gupiaoResult").html(str);
  $(".res_img").html("<img src='" + data.klinegraph.minurl + "'><img src='" + data.klinegraph.dayurl + "'>");
}

//格式化返回数据
var formatSearchTips = function(data) {
  var str = '<li class="item-content">\
                <div class="item-media"></div>\
                <div class="item-inner">\
                  <div class="item-title"></div>\
                  <div class="item-after">暂无数据...</div>\
                  <div class="item-after"></div>\
                </div>\
              </li>';
  if (data.length > 0) {
    str = ''
    $.each(data, function(i, e) {
      str += '<li class="item-content" data-type="' + e.type + '" data-name="' + e.name + '" data-code="' + e.code + '">\
                <div class="item-media"><i class="icon icon-search"></i></div>\
                <div class="item-inner">\
                  <div class="item-title">' + e.name + '</div>\
                  <div class="item-after">' + (e.type == 'sz' ? '深圳' : '上海') + '</div>\
                  <div class="item-after">' + e.code + '</div>\
                </div>\
              </li>';
    })
  }
  return str;
}