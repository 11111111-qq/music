$(document).ready(function() {
    // 
    //数据部分
    //
    var qq = JSON.parse(localStorage.getItem("17628097136"))
    var domain = 'https://mu-two.vercel.app'
    var testMusic = "http://m8.music.126.net/20220504225434/1cb78f06410d3c14ad1c9a9677789e20/ymusic/0fd6/4f65/43ed/a8772889f38dfcb91c04da915b301617.mp3";

    var testMusic2 = './imgs/1.mp3'
        // 
        //播放器处理
        //
    var $music = $('#music');


    $music.attr('src', testMusic);
    $('i.play').click(function() {
        if (document.querySelector('i.pause')) {
            $('#music').get(0).pause();
            $('i.play').toggleClass('pause').toggleClass('icon-1_music81').toggleClass('icon-music_pause');
            $('img.port').toggleClass('active');
        } else {
            $('#music').get(0).play();
            $('i.play').toggleClass('pause').toggleClass('icon-1_music81').toggleClass('icon-music_pause');
            $('img.port').toggleClass('active');

        };
    });
    $('i.pre').click(() => {
            if ($('#music').get(0).currentTime > 0) {
                $('#music').get(0).pause();
                $('#music').get(0).currentTime = 0;
                $('i.play').addClass('icon-1_music81').removeClass('icon-music_pause').removeClass('pause');
                $('img.port').removeClass('active');

            } else {

            };
        })
        // 
        //登录处理
        //
    $('.submit').click(function() {
        //请求参数
        var list = {
            'phone': $('#name').val(),
            'password': $('#password').val()
        };
        $.ajax({
            //请求方式
            type: "GET",
            url: "https://mu-two.vercel.app/login/cellphone",
            //数据，json字符串
            data: list,
            //请求成功
            success: function(result) {
                if (result.loginType == 1) {
                    alert('登录成功！');
                    var ck = JSON.stringify(result)
                    localStorage.setItem($("#name").val(), ck)
                    setCookie(result.account.id, result.account.name, 1)
                } else {
                    alert('请检查账号/密码是否正确！')
                    setCookie(qq.account.id, qq.token, 1)

                }
            },
            //请求失败，包含具体的错误信息
            error: function(e) {
                console.log(e.status);
                alert('请检查账号/密码是否正确！')
            }
        });
    })

    function swi() {
        if (document.body.clientWidth <= 992) {
            $('.bar-top').css('display', 'none')
            $('#not-offcanvasLeft').attr('id', 'offcanvasLeft')
        } else {
            $('.bar-top').css('display', 'flex')
            $('#offcanvasLeft').attr('id', 'not-offcanvasLeft')
        }
    }
    swi();
    $(window).resize(function() {
        swi();
    })();

})