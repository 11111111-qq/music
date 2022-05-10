///////////////////////////////////////////////////////////////
//-------------------------index功能页----------------------------
///////////////////////////////////////////////////////////////
$(document).ready(function() {
    //登录检查
    loginCheck()
        // $('#more').slideUp();
    $('.comment').slideUp();
    $('#musicPool').slideUp();
    //喜欢歌单功能
    //TODO:LIKE
    $('.login').on('click', 'div', function() {
            var lists = JSON.parse(sessionStorage.getItem('all')).userSongList;
            var _id = $(this).attr('data-id');
            $('#musicPool h5').html(lists[_id].name + '<' + lists[_id].num + '首>');
            $('#musicPool tbody').empty();
            $('#musicPool  tbody').append(load2);
            // $('#loaddata').load('https://mu-two.vercel.app/playlist/track/all?id=' + _id)
            ajax_ex('https://mu-two.vercel.app/playlist/track/all?id=' + _id);

            var q = new Promise((v, f) => {
                $.get('https://mu-two.vercel.app/playlist/track/all?id=' + _id, data => {
                    $('#musicPool tbody').empty();
                    getSong(data.songs, 'songslike').then(a => {

                        for (let x in a) {
                            var song = songList(a[x], 1 + eval(x));
                            $('#musicPool tbody').append(song)
                        }
                        $('#musicPool').slideDown();

                    })
                })
            })
            return false;
        })
        //搜索功能
    $('#serch').on('keyup', e => {
        var key0 = $('#serch').val();

        if (e.key == 'Enter' && key0 != '') {
            $('#musicPool tbody').empty();
            $('#musicPool tbody').append(load2)
            sessionStorage.removeItem('songs2');
            sessionStorage.removeItem('lyric');
            $('.song-index').html(key0)
            app.serchSongs(key0).then(data => {
                $('#musicPool tbody').empty();
                for (let x in data) {
                    var song = songList(data[x], 1 + eval(x));
                    $('#musicPool tbody').append(song)
                }
            });
            $('#musicPool').slideDown();
            $('#musicPool h5').html(key0);
            $('#serch').val('');
            var ul = document.getElementById("list");
            ul.style.display = "none";


        }
    });
    $('#list').on('click', 'span', function() {
        var keyword = $(this).html();
        $('#musicPool tbody').empty();
        $('#musicPool tbody').append(load2)
        $('#musicPool').slideDown();
        $('#musicPool h5').html(keyword);
        app.serchSongs(keyword).then(data => {
            $('#musicPool tbody').empty();
            for (let x in data) {
                var song = songList(data[x], eval(x));
                $('#musicPool tbody').append(song)
            }
        });

        $('.song-index').html(keyword)

        $('#serch').val('')
        var ul = document.getElementById("list");
        ul.style.display = "none";
        return false;
    });
    $('.row').on('click', 'span.badge', function() {
            $('#serch').val('')
            var ul = document.getElementById("list");
            ul.style.display = "none";
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
    $('.main_cont').on('click', 'td', function() {
        var type = $('.main_cont tbody').attr('type');
        var _id = $(this).attr('data-id');
        console.log('a', type, _id);
        if (type == 'song') {
            songPlayer(_id);
            lyrics(_id)
        }
        if (type == 'singer') {
            $('#musicPool tbody').empty();
            $('#musicPool').slideDown();
            $('#musicPool h5').html($(this).html());
            $('#musicPool tbody').append(load2)
            app.getSingerSong(_id).then(data => {
                $('#musicPool tbody').empty();
                for (let x in data) {
                    var song = songList(data[x], eval(x));
                    $('#musicPool tbody').append(song)
                }
            })
        }
        if (type == 'list') {
            songPlayer(_id);
            lyrics(_id)
        }
        if (type == 'mv') {
            $('ul.mvplayer').empty();
            app.getMvURL(_id).then(k => {
                $('video').attr('src', k)
                var e = JSON.parse(sessionStorage.getItem('all')).hotMvSort;
                for (let x in e) {
                    var infor = $('<span class="mx-3"></span>').html(e[x].name + '-' + e[x].singer);
                    var img = $('<img >').attr('src', e[x].pic).attr('title', e[x].publish);
                    var li = $('<li ></li>').append(img, infor);
                    li.attr('data-id', x)
                    $('ul.mv-player').append(li);
                }
            })
        }

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
                app.getSonglists(id).then(song => {
                    song = song[1];
                    $('img.port').attr('src', song.pic)
                    $('section.detail').children('span').eq(0).html(song.name)
                    $('section.detail').children('span').eq(1).html(' - ' + song.singer)
                    $('section.detail').children('span').eq(2).html(' - 《' + song.al + '》')
                    $('.allTime').html(song.time)
                    getMV(song.singerID);
                    singerSongs(song.singerID)
                    app.getSingerDetail(song.singerID).then(e => {

                    })
                    if ($(ad).length == 0) {
                        addMeun(song);
                    }
                })
                app.getSongURL(id).then(url => {
                    // console.log(url)
                    $('#music').attr('src', url);
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

        var lr = JSON.parse(sessionStorage.getItem('all')).lyrics;
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

    // 视频播放检查状态
    $('#mvv').on('play', function() {
            if ($('.nowMv').length == 0) {
                $('.row .port.mt-1').append($('<span class="nowMv active iconfont icon-video" data-bs-toggle="offcanvas" data-bs-target="#mvplayer"></span>'))
            } else {
                $('.nowMv').addClass('active');
            }
        })
        .on('pause', function() {
            $('.nowMv').removeClass('active');
        });

    $('ul.mv').on('click', 'li', function() {
        var _id = $(this).attr('data-id');
        $('ul.mvplayer').empty();
        app.getMvURL(_id).then(k => {
            $('video').attr('src', k);
            var e = JSON.parse(sessionStorage.getItem('all')).mvlist;
            console.log('a', typeof e);
            for (let x in e) {

                var infor = $('<span class="mx-3"></span>').html(e[x].name + '-' + e[x].singer);
                var img = $('<img >').attr('src', e[x].pic).attr('title', e[x].publish);
                var li = $('<li ></li>').append(img, infor);
                li.attr('data-id', x)
                $('ul.mv-player').append(li);
            }
        })
    });
    $('ul.mv-player,.noewMv').on('click', 'li', function() {
            var _id = $(this).attr('data-id');

            app.getMvURL(_id).then(k => {
                $('video').attr('src', k)
            })
        })
        // 
        //登录处理
        //
    $('.submit').click(() => {
            app.login($('#name').val(), $('#password').val())
        })
        //百科
    $('.baike').click(() => {
        $('#more').slideToggle(500);
    });
    $('span.com').click(() => {
        $('.comment').slideToggle(500)
        $('.com,.com2').toggleClass('active');
    })


    //推荐歌曲
    $('.main').on('click', 'td', function() {
        var _id = $(this).attr('data-id');
        songPlayer(_id);
        lyrics(_id)
    });




});

//main

//acoutn
$('.wyy').on('click', '.list1', function() {
    var _id = $(this).attr('data-id');
    $('#musicPool tbody').empty();
    $('#musicPool tbody').append(load2)
    app.getListAll(_id).then(e => {
        $('#musicPool tbody').empty();
        var data = e.songs;
        for (let x in data) {
            var song = songList(data[x], 1 + eval(x));
            $('#musicPool tbody').append(song);
            $('#musicPool h5').html(e.dis.listname).attr('title', e.dis.listmore);
        }
    });
    $('#musicPool').slideDown();

})

//main点击榜单
$(".main_bar span").click(function() {
    $(".main_bar span").removeClass('active')
    $(this).toggleClass('active')
})
$(".main_bar button").click(function() {
    $(".main_bar  div").removeClass('show')
    $(this).parent().children('div').toggleClass('show')
})
$('ul.b1').on('click', 'span', function() {
    var type = $(this).attr('type')
    $('.main_cont tbody').empty();
    $('.main_cont tbody').attr('type', '')

    var _id = $(this).attr('data-id');
    new Promise((v, f) => {
        $('.main_cont tbody').append(load2)
        app.hotSongsSort(type).then(f => {
            v(f)
            allSave('hotSongsSort', f)
        });
    }).then(a => {
        $('.main_cont tbody').empty();
        $('.main_cont tbody').attr('type', 'song')

        var e = a.songs;
        for (let x in e) {
            var song = songList(e[x], eval(x));
            $(app.initEle).append(song)
        }
    })
    return false;
})
$('ul.b2').on('click', 'span', function() {
    var type = $(this).attr('type')
    $('.main_cont tbody').empty();
    $('.main_cont tbody').attr('type', '')

    var _id = $(this).attr('data-id');
    new Promise((v, f) => {
        $('.main_cont tbody').append(load2)
        app.hotSingersSort(type).then(f => {
            v(f)
            allSave('hotSingersSort', f)
        });
    }).then(a => {
        $('.main_cont tbody').empty();
        $('.main_cont tbody').attr('type', 'singer')

        var e = a;
        for (let x in e) {
            var song = singerList(e[x], eval(x));
            $(app.initEle).append(song)
        }
    })
    return false;
})
$('.userList').on('click', function() {
    var type = $(this).attr('type')
    $('.main_cont tbody').empty();
    $('.main_cont tbody').attr('type', '')

    var _id = $(this).attr('data-id');
    new Promise((v, f) => {
        $('.main_cont tbody').append(load2)
        app.userListsRecommand().then(f => {
            v(f)
            allSave('userListsRecommand', f)
        });
    }).then(a => {
        $('.main_cont tbody').empty();
        $('.main_cont tbody').attr('type', 'list')

        var e = a.songs;
        for (let x in e) {
            var song = songList(e[x], eval(x));
            $(app.initEle).append(song)
        }
    })
    return false;
})

$('.userRec').on('click', function() {
    var type = $(this).attr('type')
    $('.main_cont tbody').empty();
    $('.main_cont tbody').attr('type', '')

    var _id = $(this).attr('data-id');
    new Promise((v, f) => {
        $('.main_cont tbody').append(load2)
        $('.main_cont tbody').attr('type', 'song')

        app.userSongsReccommand().then(f => {
            v(f)
            allSave('userSongsReccommand', f)
        });
    }).then(a => {
        $('.main_cont tbody').empty();
        var e = a.songs;
        for (let x in e) {
            var song = songList(e[x], eval(x));
            $(app.initEle).append(song)
        }
    })
    return false;
})

$('.mv1').on('click', function() {
    var type = $(this).attr('type')
    $('.main_cont tbody').empty();
    $('.main_cont tbody').attr('type', '')

    var _id = $(this).attr('data-id');
    new Promise((v, f) => {
        $('.main_cont tbody').append(load2)
        app.hotMvSort().then(f => {
            // console.log(f)
            v(f)
            allSave('hotMvSort', f)
        });
    }).then(a => {
        // console.log(a)
        $('.main_cont tbody').attr('type', 'mv')

        $('.main_cont tbody').empty();
        var e = a;
        for (let x in e) {
            var song = mvList(e[x], eval(x));
            $(app.initEle).append(song)
        }
    });
    return false;
})
$('.mv2').on('click', function() {
    var type = $(this).attr('type')
    $('.main_cont tbody').empty();
    $('.main_cont tbody').attr('type', '')
    var _id = $(this).attr('data-id');
    new Promise((v, f) => {
        $('.main_cont tbody').append(load2)
        app.hotMvNew().then(f => {
            // console.log(f)
            v(f)
            allSave('hotMvSort', f)
        });
    }).then(a => {
        // console.log(a)
        $('.main_cont tbody').attr('type', 'mv')

        $('.main_cont tbody').empty();
        var e = a;
        for (let x in e) {
            var song = mvList(e[x], eval(x));
            $(app.initEle).append(song)
        }
    });
    return false;
})