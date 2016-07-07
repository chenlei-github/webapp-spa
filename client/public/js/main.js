$(function() {


    $(document).on('click', '.open-comment', function() {
        $('#comment_box .title').html('<i class="icon icon-form-comment"></i>&nbsp;&nbsp;评价商品');
        $("#comment_form").find("#tid").remove();
        $("#comment_form").find("#cid").remove();
        $("#comment_form").find("#comment_con").val('');
        $.popup('.popup-comment');
    });

    //获取登录用户信息
    var getProfile = function() {
        $.ajax({
            type: "GET",
            url: _HOST + "user/profile",
            dataType: "jsonp",
            success: function(res) {
                var data = '';
                if (res.status == '1') {
                    var userData = res.data;
                    setCookie('user', JSON.stringify(userData));
                    $("#myImage").attr('src', userData.header_pic_oss);
                    $(".userName").text(userData.name);
                    $(".userPhone").text(userData.phone);
                    $(".userEmail").val(userData.email);
                    $(".userBirthDay").val(userData.birth_day);
                    $(".userSex").find("option[value='" + userData.sex + "']").attr("selected", true);
                }

            }
        })
    }
    getProfile();
    var userData = getCookie('user') == '' ? '' : JSON.parse(getCookie('user'));


    //提交修改用户资料
    $("#profile").on('click', '#update_profile', function() {
        var data = $("#profile_form").serialize();
        $.ajax({
            type: "GET",
            url: _HOST + "user/updateProfile",
            data: data,
            dataType: "jsonp",
            success: function(res) {
                getProfile();
                $.alert(res.msg);
            }
        })
    })

    //获取首页商品数据
    var getshoplist = function() {
        var shop_str = '';
        $.ajax({
            type: "POST",
            url: _HOST + "user/shop",
            dataType: "JSON",
            success: function(res) {
                res = eval(JSON.parse(res));
                var data = res.data;
                $.each(data.list, function(i, e) {
                    shop_str += '<div class="card">';
                    shop_str += '    <div class="card-content"><a class="shop_detail" rel="' + e._id + '" href="#detail">';
                    shop_str += '        <div class="card-content-inner">';
                    shop_str += '            <img src="' + data.oss_url + e.img + '">';
                    shop_str += '            <p class="shop_title">' + e.title + '</p>';
                    shop_str += '            <p class="desc">￥' + e.before_price + '&nbsp;';
                    shop_str += '                <del>￥' + e.price + '</del><span class="icon icon-cart pull-right"></span></p>';
                    shop_str += '        </div></a>';
                    shop_str += '    </div>';
                    shop_str += '</div>';
                });
                $('.shop_card').html(shop_str);
            }
        })
    }
    getshoplist();


    var shop_id = '';
    $("#index").on("click", ".shop_detail", function() {
        shop_id = $(this).attr('rel');
        $("#comment_form #shop_id").val(shop_id);
    })



    //格式化评论json数据
    var format_str_data = function(list, res) {
        var top_htmlStr = [];
        for (i = 0; i < list.length; i++) {
            var str = '';
            for (j = 0; j < list[i].reply.length + 1; j++) {
                str += '<div class="card facebook-card">'
            }
            top_htmlStr[i] = str;
        }

        var mstr = [];
        for (i = 0; i < list.length; i++) {
            str = '';
            str += '  <div class="facebook-avatar user_header">'
            str += '      <img src="' + res.data.oss_url + list[i]['from']['header_pic_local'] + '" width="34" height="34">'
            str += '  </div>'
            str += '  <div class="facebook-name">'
            str += '      <span class="user">' + list[i]['from']['name'] + '</span>'
            str += '      <span class="time">&nbsp;' + (list[i].reply.length > 0 ? '(1楼)' : '') + '<span>'
            str += '  </div>'
            str += '  <div class="facebook-date">' + list[i]['content']
            str += '      <p class="icon icon-message pull-right reply" alt="' + list[i]['_id'] + '" title="' + list[i]['from']['name'] + '" rel="' + list[i]['from']['_id'] + '">&nbsp;回复'
            str += '      &nbsp;&nbsp;</p>'
            str += '  </div>'
            str += '</div>'
            if (list[i].reply.length > 0) {
                for (j = 0; j < list[i].reply.length; j++) {
                    str += '  <div class="facebook-avatar user_header">'
                    str += '      <img src="' + res.data.oss_url + list[i].reply[j]['from']['header_pic_local'] + '" width="34" height="34">'
                    str += '  </div>'
                    str += '  <div class="facebook-name">'
                    str += '      <span class="user">' + list[i].reply[j]['from']['name'] + '</span>'
                    str += '      <span class="time">&nbsp;（' + (j + 2) + '楼)<span>'
                    str += '  </div>'
                    str += '  <div class="facebook-date">' + list[i].reply[j]['content']
                    str += '      <p class="icon icon-message pull-right reply" alt="' + list[i].reply[j]['_id'] + '" title="' + list[i].reply[j]['from']['name'] + '" rel="' + list[i].reply[j]['from']['_id'] + '">&nbsp;回复'
                    str += '      &nbsp;&nbsp;</p>'
                    str += '  </div>'
                    str += '</div>'
                }
            }
            mstr[i] = str;
        }

        var bstr = [];

        for (i = 0; i < list.length; i++) {
            str = '';
            for (j = 0; j < list[i].reply.length + 1; j++) {
                str += '</div>'
            }
            bstr[i] = str;
        }

        var html = '';
        for (i = 0; i < top_htmlStr.length; i++) {
            html += top_htmlStr[i] + mstr[i] + bstr[i];
        }

        return html;

    }




    //获取商品评论数据
    var getCommentList = function(id) {
            $("#comment_list").html('');
            $.ajax({
                type: "GET",
                url: _HOST + "user/comment/list",
                data: { shop: id },
                dataType: "jsonp",
                success: function(res) {
                    if (res.status == 1 && res.data.list.length > 0) {
                        var list = res.data.list;
                        $("#comment_list").html(format_str_data(list, res));
                    }
                }
            })
        }
        //获取商品详细数据
    var getShopDetail = function() {
        if (shop_id == '') {
            $.router.load("#index");
            return false;
        }
        $.ajax({
            type: "GET",
            url: _HOST + "user/shop/detail/" + shop_id,
            dataType: "jsonp",
            success: function(res) {
                if (res.status == 1) {
                    var row = res.data.row;
                    $("#detail .shop_img").attr('src', res.data.oss_url + row.img);
                    $("#detail .sale_title").text(row.title);
                    $("#detail .rel_price").text('￥' + row.price);
                    $("#detail .before_price del").text('￥' + row.before_price);
                }
            }
        })

        getCommentList(shop_id); //加载商品所有用户评论
    }

    //提交评论，回复
    $(".popup-comment").on("click", ".sub_comment", function() {
        var shop = $("#shop_id").val(),
            content = $.trim($("#comment_con").val());
        if (shop == '' || content == '') {
            $.alert('提交的数据不完整');
            return false;
        }
        var data = $("#comment_form").serialize();
        $.ajax({
            type: "GET",
            url: _HOST + "user/comment",
            data: data,
            dataType: "jsonp",
            success: function(res) {
                getCommentList(shop);
                $.alert(res.msg);
                $.closeModal('.popup-comment');

            }
        })
    })

    //点击回复评论数据初始化
    $("#comment_list").on("click", ".reply", function() {
        var tid = $(this).attr('rel');
        var cid = $(this).attr('alt');
        var name = $(this).attr('title');
        $('#comment_box .title').html('<i class="icon icon-form-comment"></i>&nbsp;&nbsp;回复' + '【' + name + '】');
        $("#comment_form").find("#tid").remove();
        $("#comment_form").find("#cid").remove();
        $("#comment_form").find("#comment_con").val('');
        $('<input>').attr({ type: 'hidden', id: 'tid', name: 'row[tid]', value: tid }).appendTo('#comment_form');
        $('<input>').attr({ type: 'hidden', id: 'cid', name: 'row[cid]', value: cid }).appendTo('#comment_form');
        $.popup('.popup-comment');
    })


    //路由监听
    $(document).on("pageInit", function(e, id, page) {
        switch (id) {
            //登入注册
            case 'login':
            case 'register':
                if ($(".userName").text() != '请登录...' && $(".userName").text() != '') {
                    $.router.load("#profile");
                }
                break;
                //个人中心数据
            case 'profile':
                getProfile();
            case 'detail':
                getShopDetail();

        }
    });


    var time_num = 15; //获取验证码最小时间间隔
    var settime = function(btn, num) {
        if (btn.hasClass('disabled')) {
            return false;
        }

        function start(btn) {
            if (num == 0) {
                btn.removeClass("disabled");
                btn.text("获取验证码");
                num = time_num;
                return false;
            } else {
                btn.addClass("disabled");
                btn.text("重新发送(" + num + ")");
                num--;
            }
            setTimeout(function() { start(btn) }, 1000);
        }
        start(btn);
    }

    //切换登录方式
    $(".login_type").on('click', 'a', function() {
        var type_val = 1;
        if ($(this).attr('href') == '#yzm_login') {
            type_val = 2;
            $('.code_btn_line').show();
        } else {
            $('.code_btn_line').hide();
        }
        $("#login_type_val").val(type_val);
    })

    //请求验证码数据
    var exec_send = function(phone_num) {
            $.ajax({
                type: "GET",
                url: _HOST + "user/getVerifyCode",
                data: { phone: phone_num },
                dataType: "jsonp",
                success: function(res) {
                    if (res.status == '1') {
                        $.alert(res.msg);
                    }
                }
            })
        }
        //点击获取验证码事件
    $(document).on('click', '.get_code', function() {
        var isSend = $(this).hasClass('disabled') ? false : true;
        var phone_num = $('#' + $(this).attr('rel')).find(".phone_num").val() || '';
        settime($(this), time_num);
        if (isSend && phone_num) {
            exec_send(phone_num);
        }
    })

    //提交登录
    $("#login").on('click', '#exec_login', function() {
            var data = $("#login_form" + $("#login_type_val").val()).serialize();
            $.ajax({
                type: "GET",
                url: _HOST + "user/login",
                data: data,
                dataType: "jsonp",
                success: function(res) {
                    if (res.status == '1') {
                        setCookie('user', JSON.stringify(res.data));
                        $.alert(res.msg, function() {;
                            $.router.load("#profile");
                            //window.location.reload();
                        })
                    } else {
                        $.alert(res.msg);
                    }
                }
            })
        })
        //提交注册
    $("#register").on('click', '#exec_register', function() {
        var allow_submit = true;
        $("#register").find("input").each(function() {
            if ($(this).val() == '' || typeof($(this).val()) == 'undefined') {
                var input_name = $(this).parent('div').prev('div').text();
                $.alert(input_name + '不能为空！');
                allow_submit = false;
                return false;
            }
        })
        if (!allow_submit) {
            return false;
        }
        var data = $("#register_form").serialize();
        $.ajax({
            type: "GET",
            url: _HOST + "user/register",
            data: data,
            dataType: "jsonp",
            success: function(res) {
                if (res.status == '1') {
                    $.alert(res.msg, function() {
                        $.router.load("#index");
                    })
                } else {
                    $.alert(res.msg);
                }
            }
        })
    })


    $("#profile").on('click', '#userImage', function() {
            if (userData == '') {
                $.router.load("#login", true);
            }
        })
        //注销方法，清除cookie,session
    $("#profile").on('click', '.logout', function() {
        $.ajax({
            type: "GET",
            url: _HOST + "user/logout",
            dataType: "jsonp",
            success: function(res) {
                if (res.status == '1') {
                    $(".userName").text('');
                    delCookie('user');
                    $.alert('退出成功');
                }
            }
        })
    })


    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期 
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    }

    $(".birth_day").calendar({
        dateFormat: 'mm-dd'
    });
    $("#startDate").calendar({
        minDate: GetDateStr(0),
        maxDate: GetDateStr(59)
    });


    $("#startAddr").val("");
    $("#endAddr").val("");
    //提交查询火车票
    $("#train").on("click", ".search_train", function() {
        $("#train-data-list").html("");
        var from = $("#startAddr").attr("data-code") || '',
            to = $("#endAddr").attr("data-code") || '',
            date = $("#startDate").val() || '';
        if (from == '' || to == '' || date == '') $.alert('提交的数据不完整');
        $.ajax({
            type: "GET",
            data: { from: from, to: to, date: date },
            url: _HOST + "user/train/getTickets",
            dataType: "jsonp",
            success: function(results) {
                var res = JSON.parse(results.data) || [];
                if (results.status == '1' && res.data.length > 0) {
                    $("#train-data-list").html(formatTrainData(res.data));
                }
            }
        })
    })

    var formatTrainData = function(data) {
        //console.log(data);
        var str = '<li>\
              <div class="item-content">\
                <div class="item-inner">\
                  <div class="item-title b">车次</div>\
                  <div class="item-title b">出发站</div>\
                  <div class="item-title b">到达站</div>\
                  <div class="item-title b">历时</div>\
                </div>\
              </div>\
            </li>',
            nameArr = [
                ['swz_num', '商务座'],
                ['tz_num', '特等座'],
                ['zy_num', '一等座'],
                ['ze_num', '二等座'],
                ['gr_num', '高级软卧'],
                ['rw_num', '软卧'],
                ['yw_num', '硬卧'],
                ['rz_num', '软座'],
                ['yz_num', '硬座'],
                ['wz_num', '无座']
            ];
        if (data.length > 0) {
            $.each(data, function(i, row) {
                var site_str = '';
                $.each(nameArr, function(ii, ee) {
                    if (eval('row.queryLeftNewDTO.' + ee[0]) != '--') {
                        site_str += '<div class="item-title">' + ee[1] + '：' + eval('row.queryLeftNewDTO.' + ee[0]) + '</div>';
                    }
                })

                var s_icon = 'pass_icon',
                    e_icon = 'pass_icon';
                if (row.queryLeftNewDTO.from_station_telecode == row.queryLeftNewDTO.start_station_telecode) {
                    s_icon = 'start_icon';
                }
                if (row.queryLeftNewDTO.to_station_telecode == row.queryLeftNewDTO.end_station_telecode) {
                    e_icon = 'end_icon';
                }

                str += '<li class="train_info">\
                          <div class="item-content">\
                            <div class="item-inner">\
                              <div class="item-title">' + row.queryLeftNewDTO.station_train_code + '</div>\
                              <div class="item-title">\
                                  <i class="_icon ' + s_icon + '"></i>' + row.queryLeftNewDTO.from_station_name + '<br/><span class="time">' + row.queryLeftNewDTO.start_time + '</span>\
                              </div>\
                              <div class="item-title">\
                                  <i class="_icon ' + e_icon + '"></i>' + row.queryLeftNewDTO.to_station_name + '<br/><span class="time">' + row.queryLeftNewDTO.arrive_time + '</span>\
                              </div>\
                              <div class="item-title">' + row.queryLeftNewDTO.lishi + '</div>\
                            </div>\
                          </div>\
                        </li>\
                        <li class="site_info">\
                          <div class="item-content">\
                            <div class="item-inner">' + site_str + '</div>\
                          </div>\
                        </li>';
            })
        }

        return str;

    }

    //城市地址输入提示
    $("#train").on("keyup", ".addr-input", function() {
        var tipStr = '',
            val = $.trim($(this).val()) || '',
            tipDiv = $(this).parent("div").parent("div").parent("div").siblings(".list-block").find("ul");
        $(".addr").find('.list-block ul').empty();
        $(this).attr("data-code", '');
        if (val != '') {
            tipDiv.html(addrTips(val));
        }
    })

    $(".tips_box").on("click", ".item-content", function() {
        var name = $(this).attr("data-name"),
            code = $(this).attr("data-code"),
            type = $(this).parent("ul").attr("data-type");
        $('#' + type).val(name).attr("data-code", code);
        $(".addr").find('.list-block ul').empty();
    })


    function isChinese(str) {
        var reg = /[^\u4E00-\u9FA5]/g;
        return reg.test(str) ? false : true;
    }

    //地址搜寻提示
    var addrTips = function(addr) {
        var stationArr = station_names.split('|'),
            addrArr = [];
        for (i = 0; i < 2567; i++) {
            var index = isChinese(addr) ? parseInt(5 * i + 1) : parseInt(5 * i + 3),
                station = typeof(stationArr[index]) == 'undefined' ? '' : $.trim(stationArr[index]);
            if (station == '') continue;
            if (station.indexOf(addr) > -1) {
                var tmp = [
                    stationArr[parseInt(5 * i + 2)],
                    stationArr[parseInt(5 * i + 1)],
                    stationArr[parseInt(5 * i + 3)]
                ];
                addrArr.push(tmp);
            }
        }
        return formatAddrData(addrArr);
    }

    var formatAddrData = function(data) {
        var str = '<li class="item-content">\
                    <div class="item-media"></div>\
                    <div class="item-inner">\
                      <div class="item-title"></div>\
                      <div class="item-after">未找到该站点...</div>\
                      <div class="item-after"></div>\
                    </div>\
                  </li>';
        if (data.length > 0) {
            str = '';
            $.each(data, function(i, e) {
                str += '<li class="item-content" data-name="' + e[1] + '" data-code="' + e[0] + '">\
                            <div class="item-media"><i class="icon icon-search"></i></div>\
                            <div class="item-inner">\
                                <div class="item-title">' + e[1] + '</div>\
                                <div class="item-after">' + e[2] + '</div>\
                            </div>\
                        </li>';
            })
        }
        return str;
    }

    $.init();

});
