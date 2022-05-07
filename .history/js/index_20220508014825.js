///////////////////////////////////////////////////////////////
//-------------------------index功能页----------------------------
///////////////////////////////////////////////////////////////
$(document).ready(function() {
    /*
        *：
        ?：
        !：测试
        TODO:
        @param:
        */

    //登录检查
    //初始化
    playerReset();
    // document.body.style.overflow = 'hidden';
    $('#more').slideUp();
    $('.comment').slideUp();
    $('#musicPool').slideUp();
    listsRecommand();
    //搜索功能
    $('#serch').bind('keyup', e => {
        var key0 = $('#serch').val();
        if (e.key == 'Enter' && key0 != '') {
            // $('.main table').removeClass('hide');
            $('#list').attr('display', 'none')
            $('tbody').empty();
            $('tbody').append(load2)
            sessionStorage.removeItem('songs2');
            sessionStorage.removeItem('lyric');
            $('.song-index').html(key0)
            serch(key0)
            $('#musicPool').slideDown();
            $('#musicPool h5').html(key0);

        }
    })
    $('#list').on('click', 'span', function() {
        var keyword = $(this).children('.baiduResult').html();
        $('#serch').html('')

        serch(keyword);
        $('tbody').empty();
        $('tbody').append(load2)
        sessionStorage.removeItem('songs2');
        sessionStorage.removeItem('lyric');
        $('.song-index').html(keyword)
        $('#musicPool').slideDown();
        $('#musicPool h5').html(keyword);
        return false;
    });
    $('.row').on('click', 'span.badge', function() {
            $('#serch').val('')
            var ul = document.getElementById("list");
            ul.style.display = "none";

            $('#list').attr('display', 'none')
                // alert(5)
            return false;
        })
        // 
        //点击播放功能
        //
    $('#musicPool').on('click', 'td', function() {
        var _id = $(this).attr('data-id');
        songPlayer(_id);
        lyrics(_id)
    });
    $('.poolclose').click(() => {
        $('#musicPool').slideUp();
    });
    $('.poolopen').click(() => {
        $('#musicPool').slideToggle().addClass('show');
    });
    $('.poolup').click(() => {
        // alert(5)

        $('#musicPool .tt').get(0).scrollTo(0, 0);
        return false;
    });
    $('.pooldown').click(() => {
        $('#musicPool  .tt').get(0).scrollTo(0, 2000);

        return false;
    })

    function songPlayer(id, type = false) {
        try {
            playerReset();
            songComment(id);
            var ad = '#a' + id;
            $('.detail').attr('data-id', id);
            if ($(ad).length == 0 || type) {
                var detailURL = domain + '/song/url?id=' + id;
                var song;
                if (JSON.parse(sessionStorage.getItem('songs2')) != null && JSON.parse(sessionStorage.getItem('songs2'))[id]) {
                    song = JSON.parse(sessionStorage.getItem('songs2'))[id];
                } else if (JSON.parse(sessionStorage.getItem('songs3')) != null && JSON.parse(sessionStorage.getItem('songs3'))[id]) {
                    song = JSON.parse(sessionStorage.getItem('songs3'))[id]
                } else if (JSON.parse(sessionStorage.getItem('songsRecommend')) != null && JSON.parse(sessionStorage.getItem('songsRecommend'))[id]) {
                    song = JSON.parse(sessionStorage.getItem('songsRecommend'))[id]
                } else {
                    song = JSON.parse(sessionStorage.getItem('listsongs'))[id]
                }
                sessionStorage.removeItem('songs3') ? sessionStorage.removeItem('songs3') : '';
                console.log(song)

                $('img.port').attr('src', song.pic)
                $('section.detail').children('span').eq(0).html(song.name)
                $('section.detail').children('span').eq(1).html(' - ' + song.singer)
                $('section.detail').children('span').eq(2).html(' - 《' + song.al + '》')
                $('.allTime').html(song.time)
                    //歌手mv
                getMV(song.singerID)
                    //歌手mv
                function p1(x) {
                    let p = new Promise((v, f) => {
                        $.post(x, e => {
                            // console.log(e)
                            v(e);
                        });
                    })
                    return p;
                }
                p1(detailURL).then(e => {
                    var url = e.data[0].url;
                    if (!url) {
                        url = 'https://music.163.com/song/media/outer/url?id=' + id + '.mp3'
                    }
                    $('#music').attr('src', url);


                    if ($(ad).length == 0) {
                        addMeun(id);
                    }

                    if (type) {
                        $('i.play').click();
                        $('i.play').click();

                    } else {
                        $('i.play').click();
                    }


                    //设置当前正在播放
                    $('.meun ul li').removeClass('on');
                    $('.meun ul li[data-id=' + id + ']').toggleClass('on text-light')
                })
            } else {
                $('i.play').click();

            }
            //相似歌曲
            simsongs(id).then(e => {
                for (let x in e) {

                    var infor = $('<span class="mx-3"></span>').html(e[x].name + '-' + e[x].singer + '/' + e[x].al);
                    var img = $('<img >').attr('src', e[x].pic);
                    var li = $('<li></li>').append(img, infor);
                    li.attr('data-id', x)
                    $('ul.similar').append(li);
                }
            })
        } catch (error) {

        }


    }
    //歌单部分

    $('.meun').on('click', 'li', function() {
        var _id = $(this).attr('data-id');
        // console.log(_id)
        songPlayer(_id, true);
        lyrics(_id)
    });
    $('.clear-all').on('click', function() {
        $('.meun ul').empty().append('<li class="clear-all list-group-item">清空</li>');
        $('i.pre').click();

    });
    $('.meun').on('click', 'span', function() {
        $(this).parent().remove();
        $('.count.badge').html($('.meun ul li').length - 1)

        return false;
    });
    $('.main').on('click', 'i', function() {
        var _id = $(this).parent().attr('data-id').replace('a', '') ? $(this).parent().attr('data-id').replace('a', '') : $(this).parent().attr('data-id');
        // console.log(_id)
        addMeun(_id);
        return false;
    })

    //播放器功能
    var prePlayer = '';
    var nextPlay = '';
    var nowPlay = './imgs/1.mp3'
    var $music = $('#music');
    $music.attr('src', nowPlay);
    $('i.play').click(function() {
        if (document.querySelector('i.pause')) {
            $('#music').get(0).pause();
            $('i.play').toggleClass('pause').toggleClass('icon-1_music81').toggleClass('icon-music_pause');
            $('img.port').toggleClass('active');
        } else {
            try {
                $('#music').get(0).play();
            } catch (error) {
                playerReset();
                alert('无法播放！')

            }

            $('i.play').toggleClass('pause').toggleClass('icon-1_music81').toggleClass('icon-music_pause');
            $('img.port').toggleClass('active');

        };
    });
    $('i.pre').click(() => {
        if ($('.pre0').length == 0) {
            $('#music').get(0).pause();
            $('#music').get(0).currentTime = 0;
            $('i.play').addClass('icon-1_music81').removeClass('icon-music_pause').removeClass('pause');
            $('img.port').removeClass('active');
            $('i.pre').addClass('pre0')
        } else {
            var index = $('.on').attr('index');
            $('i.pre').removeClass('pre0')
            var _id = $('li[index=' + (index - 1) + ']').attr('data-id');
            if (index > 1) {
                songPlayer(_id, true);
                lyrics(_id)
            }
        };
    });
    $('i.next').click(() => {
            var index = $('.on').attr('index');
            var _id = $('li[index=' + (eval(index) + 1) + ']').attr('data-id');
            if (!_id) {
                _id = $('li[index="1"]').attr('data-id');
            }

            songPlayer(_id, true);
            lyrics(_id)
        })
        //
        //拖动音乐进度
        //
    $('span.lrics').on('mousedown', function(e) {
            if ($('#music').get(0).currentTime != 0) {
                var ratio = e.offsetX / $('span.lrics').get(0).offsetWidth;
                $('.progress').css('width', ratio * 100 + '%')
                $('#music').get(0).currentTime = $('#music').get(0).duration * ratio;
            }
        })
        //
        //音乐进度更新
    var mus = document.getElementById('music');
    mus.ontimeupdate = function() {
        var t1 = mus.currentTime;
        t1 = Number(t1);
        var t2 = timeFormat(t1 * 1000)
        $('span.now').html(t2);
        $('.lrics .progress').css('width', mus.currentTime / mus.duration * 100 + '%');
        var lr = JSON.parse(sessionStorage.getItem('lyric'));
        if (lr) {
            var c = '';
            for (let x in lr) {
                if (lr[x][0] == t2) {
                    c = x;
                    break;
                }
            }
            try {
                $('.nowLyric').html(lr[c][1]);
                if (c > 1) {
                    $('p.l1').html(lr[c - 2][1]);
                    $('p.l2').html(lr[c - 1][1]);
                }
                $('p.l3').html(lr[c][1]);
                $('.xx').text(lr[c][1]);
                $('p.l4').html(lr[eval(c) + 1][1]);
                $('p.l5').html(lr[eval(c) + 2][1]);
            } catch (error) {}
        }
        if (t1 == mus.duration) {
            mus.currentTime = 0;
            $('i.next').click();
        }
    }
    $('.voice').attr('value', '50').on('change', function() {
            $('#music').get(0).volume = $('.voice').val() / 100;
        })
        // 
        //相似歌曲
        //
    $('ul.similar').on('click', 'li', function() {
            var _id = $(this).attr('data-id');
            songPlayer(_id, true);
            lyrics(_id)
        })
        //
        //mv
        //
    $('ul.mv').on('click', 'li', function() {
        var _id = $(this).attr('data-id');
        $('ul.mvplayer').empty();
        openMV(_id).then(k => {
            $('video').attr('src', k)
            var e = JSON.parse(sessionStorage.getItem('mvlist'));
            for (let x in e) {
                var infor = $('<span class="mx-3"></span>').html(e[x].name + '-' + e[x].singer);
                var img = $('<img >').attr('src', e[x].pic).attr('title', e[x].publish);
                var li = $('<li ></li>').append(img, infor);
                li.attr('data-id', x)
                $('ul.mv-player').append(li);
            }
        })
    });
    $('ul.mv-player').on('click', 'li', function() {
            var _id = $(this).attr('data-id');
            openMV(_id).then(k => {
                $('video').attr('src', k)
            })
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
        //百科
    $('.baike').click(() => {
        $('#more').slideToggle(500);
    });
    $('span.com').click(() => {
        $('.comment').slideToggle(500)
        $('.com,.com2').toggleClass('active');
    })



    $('.main').on('click', 'li', function() {
        $('tbody').empty();
        $('tbody').append(load2)
        var _id = $(this).attr('data-id');
        // console.log(_id)
        getReclists(_id)
        $('#musicPool').slideToggle(500).addClass('show');
    })

    $('h4').click(() => {
        console.log($('#a1').get(0).contentWindow)
    })


    //推荐歌曲
    $('.main').on('click', 'td', function() {
        var _id = $(this).attr('data-id');
        songPlayer(_id);
        lyrics(_id)
    });

    $('iframe').attr('src', 'https://mu-two.vercel.app/user/account')

});
window.onload = () => {
        songsRecommand();
        var doc = document.querySelector('iframe');
        console.log()
    }
    /*
    *：
    ?：
    !：
    TODO:
    @param:
    */