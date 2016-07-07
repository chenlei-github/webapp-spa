var getProv = function(val) {
    $.ajax({
        type: 'GET',
        url: _HOST + 'user/weather/getAddr',
        data: { provshi: val },
        dataType: 'jsonp',
        success: function(data) {
            $("#district").empty();
            $("#city").empty();
            if (data.status == 200) {
                $.each(data.list, function(i, items) {
                    $('<option value="' + i + '">' + items + '</option>').appendTo("#district");
                })
                var cid = (val == '10101' || val == '10102' || val == '10103' || val == '10104') ? '00' : '01';
                getCity(val + cid);
            } else {
                $.alert(data.msg);
            }
        }
    });
}
var getCity = function(val) {
    $.ajax({
        type: 'GET',
        url: _HOST + 'user/weather/getAddr',
        data: { station: val },
        dataType: 'jsonp',
        success: function(data) {
            $("#city").empty();
            if (data.status == 200) {
                $.each(data.list, function(i, items) {
                    $('<option value="' + i + '">' + items + '</option>').appendTo("#city");
                })
            } else {
                $.alert(data.msg);
            }
        }
    });
}
var getRealId = function(){
    var $realid = '',
    $provid = $("#prov").val(),
    $districtid = $("#district").val(),
    $cityid = $("#city").val();
    if ($provid == '10101' || $provid == '10102' || $provid == '10103' || $provid == '10104') {
        $realid = $provid + $cityid + $districtid;
    } else {
        $realid = $provid + $districtid + $cityid;
    }
    if ($cityid.length == 9) $realid = $cityid;
    return $realid;
}

$("#weather_addr").on("change", "#prov", function() {
    var val = $(this).val();
    getProv(val);
});

$("#weather_addr").on("change", "#district", function() {
    var val = $(this).val();
    getCity($("#prov").val() + val);
})

$("#weather_addr").on("click", "#search_weather", function() {
  var id = getRealId();
  setCookie('weather_id',id);
  getData(id);
  
})

var getData = function(id){
  url = _HOST + 'user/weather/';
  $.ajax({
    type: 'GET',
    url: url + 'getDayWeather',
    data: { id: id },
    dataType: 'jsonp',
    success: function(res) {
        if (res.status == 200) {
            formatDayWeather(res.data);
        } else {
            $.alert('获取当天天气信息失败~');
        }
    }
  });
  $.ajax({
    type: 'GET',
    url: url + 'getWeekWeather',
    data: { id: id },
    dataType: 'jsonp',
    success: function(res) {
        if (res.status == 200) {
            formatWeekWeather(res.data);
        } else {
            $.alert('获取最近一周天气信息失败~');
        }
    }
  });
}

var formatDayWeather = function(data) {
  $("#weather .top_main").attr("style","background:url(http://i.tq121.com.cn/i/wap/index390/"+data.weathercode+'.jpg) no-repeat center center');
  $('#weather .top_main .weather-icon').empty();
  $('<img>').attr({ src:'http://i.tq121.com.cn/i/wap/80bai/'+data.weathercode+'.png' }).appendTo('#weather .top_main .weather-icon');
  $("#weather .top_main .addr").text(data.cityname);
  $("#weather .top_main .temp").text(data.temp+'℃');
  $("#weather .top_main .weather_info").text(data.weather);
  $("#weather .top_main .wd").text(data.WD);
  $("#weather .top_main .current_time").text(data.date);
  $("#weather .top_main .update_time").text(data.time+' 更新');
}
var formatWeekWeather = function(data) {
  var str = '';
  for (var i = 0; i < data.length; i++) {
      str += '<li class="item-content">\
    <div class="item-inner">\
      <div class="item-title">' + data[i].time + '</div>\
      <div class="item-media">' + data[i].icon + '</div>\
      <div class="item-after">' + data[i].temp + '</div>\
    </div>\
  </li>';
  }
  $("#week_weather_list").html(str);
}
//默认查询昌平天气，否则取历史查询地址天气
var id = getCookie('weather_id')==''?'101010700':getCookie('weather_id');
getData(id);


