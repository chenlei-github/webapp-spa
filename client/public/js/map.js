$(function() {
    function G(id) {
        return document.getElementById(id);
    }
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var geolocation = new BMap.Geolocation();
    var geoc = new BMap.Geocoder();

    //定位当前位置
    var x, y;
    geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                var point = new BMap.Point(r.point.lng, r.point.lat);
                map.centerAndZoom(point, 13);
                x = r.point.lng;
                y = r.point.lat;

                //当前城市
                var city = new BMap.LocalCity();
                //alert(current_city);
                city.get(current_city);
            } else {
                alert('定位失败');
            }
        }, { enableHighAccuracy: true })
        //点击解析地址
    var point = new BMap.Point(x, y);
    map.centerAndZoom(point, 13);
    map.enableScrollWheelZoom(true);

    map.addEventListener("click", function(e) {
        var pt = e.point;
        geoc.getLocation(pt, function(rs) {
            var addComp = rs.addressComponents;
            alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        });
    });

    //当前城市
    function current_city(result) {
        var cityName = result.name;
        $(".location_select input").val(cityName);
    }
    $("#city-picker").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker" id="sub_addr">确定</button>\
    <h1 class="title">选择地址</h1>\
    </header>'
    });

    //切换城市
    $(document).on('click', '#sub_addr', function() {
        var addr = $('#city-picker').val();
        map.centerAndZoom(addr, 13);
    })

    function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    //搜索提示
    var ac = new BMap.Autocomplete({ "input": "addrKeyWords", "location": map });
    ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace();
    });

    //搜索提示
    var start = new BMap.Autocomplete({ "input": "start_addr", "location": map });
    start.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    start.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace();
    });

    //搜索提示
    var end = new BMap.Autocomplete({ "input": "end_addr", "location": map });
    end.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    end.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace();
    });


     //自驾路线
    var driving = function(start,end){
        new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}}).search(start,end);
    }

    //公交路线
    var transit = function(start,end){
        new BMap.TransitRoute(map, {renderOptions: {map: map, panel: "r-result"}}).search(start, end);
    }

    //步行路线
    var walk = function(start,end){
        new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}}).search(start,end);
    }

    $(document).on("click",".sub_way",function(){
        var start = $("#start_addr").val(),
        end = $("#end_addr").val(),
        obj =  document.getElementById("way_type"),
        wayName = obj.options[obj.options.selectedIndex].value;
        eval(wayName+'(start,end)');
    })



})
