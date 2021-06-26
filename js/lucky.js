wy_title = $('title').text()
function loading() {
    $.ajax({
        type: 'GET',
        url: 'https://api.bingdou.xyz/music/music.php',

        data: 'format=json&id=3778678',// 可以在这里指定歌单,也可以不指定
        dataType: 'json',
        success: function (lucky) {
            if (lucky['code'] == 200) {
                $('#pic').html('<img src="' + lucky['data']['avatarurl'] + '">');
                $("#info_song").html(lucky['data']['name']);
                $("#info_song_auther").html('歌手-' + lucky['data']['artistsname']);
                $('.lucky_loading_frame').hide();
                $(".bg_image").css({
                    "background": "url(" + lucky['data']['picurl'] + ") no-repeat center"
                });
                
                //如果歌曲链接失效则不显示播放按钮
                if (lucky['data']['song_url'] !== null) {
                    $("#music").html('<audio id="player" src="' + lucky['data']['url'] + '" controls="controls"></audio>')
                    $('#player_btn').html('<img src="../images/play.png">');
                }
                var html;
                    html = '<div id="info_content">';
                    html += lucky['data']['content'];
                    html += '</div>';
                    $("#info_tag").append(html);
                
            }
        }
    });
}
loading();

/**
 * cookie播放
 */
if (getCookie('player') == 1) {
    setTimeout(function () {
        is_player();
    }, 1500);
}

/**
 * 切换下一条
 */
$('#next').on('click', function () {
    next()
});
function next() {
	$('title').text(wy_title)
    $('.lucky_loading_frame').show();
    $("#info_song").html('Loding...');
    $("#info_content").remove()
    $("#music").html('Player-Loding...');
    loading()
    if (getCookie('player') == 1) {
        setTimeout(function () {
            is_player();
        }, 1500);
    }
}

/**
 * 播放音乐
 */
$('#player_btn').on('click', function () {
    is_player()
});
function is_player() {
    var player = $("#player")[0];
    /*如果已经暂停*/
    if (player.paused) {
        /*播放*/
        player.play();
        var title = $("#info_song").text();
        $('title').text('正在播放-♫'+ title)
        setCookie('player', '1')
        $("#pic img").css({
            "-webkit-animation": "lucky infinite 5s linear",
            "animation": "lucky infinite 5s linear"
        });
        $('#player_btn').html('<img src="../images/pause.png">');
    } else {
        /*暂停*/
        player.pause();
        $('title').text(wy_title)
        setCookie('player', '0')
        $("#pic img").removeAttr("style", "");
        $('#player_btn').html('<img src="../images/play.png">');
    }

    //判断是否播放完毕
    player.loop = false;
    player.addEventListener('ended', function () {
        next()
    }, false);
}

/**
 * 写cookies
 * @param {*} name 
 * @param {*} value 
 */
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/**
 * 读取cookies
 * @param {*} name 
 */
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}

/**
 * 删除cookies
 * @param {*} name 
 */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
