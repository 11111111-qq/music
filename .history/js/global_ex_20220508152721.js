///////////////////////////////////////////////////////////////
//-------------------------函数定义----------------------------
///////////////////////////////////////////////////////////////
//登录
function login() {
    //请求参数
    var list = {
        'phone': $('#name').val(),
        'password': $('#password').val()
    };
    new Promise(() => {
        p();
    })

    function p() {
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
                    var e = result;
                    var user = {};
                    user.id = e.profile.userId;
                    user.name = e.profile.nickname;
                    user.pic = e.profile.avatarUrl;
                    user.bg = e.profile.backgroundUrl;
                    user.status = e.account.status;
                    console.log(user)
                    setCookie('tingmusic', JSON.stringify(user), 2);

                } else {
                    alert('请检查账号/密码是否正确！')
                }
            },
            //请求失败，包含具体的错误信息
            error: function(e) {
                console.log(e.status);
                alert('请检查账号/密码是否正确！')
            }


        }).then(() => { document.location.reload(); });
    }


}

//登录检查
//
function loginCheck() {
    $('.notlogin').css('display', 'flex')
    $('.login').css('display', 'none')
    var user = getCookie('tingmusic');
    if (user) {
        $('.notlogin').css('display', 'none')
        $('.login').css('display', 'flex')

        user = JSON.parse(user);
        // console.log(user)
        $('.offcanvas-body.login').css('background', 'whitesmoke').css('background-size', 'cover');
        $('.login img').attr('src', user.pic)
        $('.login .infor .nameid').html('id:' + user.id)
        $('.login .infor .name').html(user.name);
    }
}
//获取喜欢歌曲列表
function songslike(userID) {
    let p = new Promise((v, f) => {
        $('#loaddata').get('https://mu-two.vercel.app/likelist?uid=', e => {
            if (e) {
                e = JSON.parse(e);
                var user = {};
                user.id = e.profile.userId;
                user.name = e.profile.nickname;
                user.pic = e.profile.avatarUrl;
                user.bg = e.profile.backgroundUrl;
                user.status = e.account.status;
            }
            setCookie('tingmusic', JSON.stringify(user), 2);
        })
    })
}
//获取已登录账户信息
function checkuser() {
    let p = new Promise((v, f) => {
        $('#loaddata').load('https://mu-two.vercel.app/user/account', e => {
            if (e) {
                e = JSON.parse(e);
                var user = {};
                user.id = e.profile.userId;
                user.name = e.profile.nickname;
                user.pic = e.profile.avatarUrl;
                user.bg = e.profile.backgroundUrl;
                user.status = e.account.status;
            }
            setCookie('tingmusic', JSON.stringify(user), 2);
        })
    })
}
//自适应
// function swi() {
//     if (document.body.clientWidth <= 992) {
//         $('.switch').css('display', 'flex');
//         $('.bar-top').css('display', 'none');
//         $('#not-offcanvasLeft').attr('id', 'offcanvasLeft')
//     } else {

//         $('.bar-top').css('display', 'flex');
//         $('#offcanvasLeft').attr('id', 'not-offcanvasLeft')
//     }
// }

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//查找cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

//检查cookie
function checkCookie(key, fn1, fn2) {
    var data = getCookie(key);
    if (username != "") {
        fn1().call(null, data);
    } else {
        fn2().call(null, data);
    }
}
//歌曲列表
function songList(song, index) {
    var tr = $('<tr></tr>');
    tr.attr('data-id', song.id)
    var td1 = $('<td>' + index + '</td>');
    var td2 = $('<td><img><span></span><span></span><i></i></td>')
    td2.children('img').attr('src', song.pic).attr('data-id', song.id);
    td2.children('i').attr('class', "iconfont icon-circle-next mx-1").attr('data-id', song.id);
    td2.children('span').eq(0).attr('class', 'song').html(song.name).attr('data-id', song.id);
    td2.children('span').eq(1).attr('class', 'res').html(song.al).attr('data-id', song.id);
    var td3 = $('<td>' + song.time + '</td>')
    var td4 = $('<td>' + song.singer + '<i class="iconfont icon-add mx-2 my-2 "></i></td>')
    td1.attr('data-id', song.id);
    td2.attr('data-id', song.id);
    td3.attr('data-id', song.id).attr('data-time', song.time).attr('class', 'dataTime');
    td4.attr('data-name', song.name).attr('class', 'dataName').attr('data-id', 'a' + song.id);
    tr.append(td1, td2, td3, td4);
    if (song.fee == 1 || song.fee == 4) {
        td1.append('--vip--')
    }
    return tr;
}
//meun
function addMeun(id) {
    var total = $('.meun ul li').length;
    var song;
    if (JSON.parse(sessionStorage.getItem('songs2')) != null && JSON.parse(sessionStorage.getItem('songs2'))[id]) {
        song = JSON.parse(sessionStorage.getItem('songs2'))[id];
    } else if (JSON.parse(sessionStorage.getItem('songsRecommend')) != null && JSON.parse(sessionStorage.getItem('songsRecommend'))[id]) {
        song = JSON.parse(sessionStorage.getItem('songsRecommend'))[id]
    } else if (JSON.parse(sessionStorage.getItem('singersongs')) != null && JSON.parse(sessionStorage.getItem('singersongs'))[id]) {
        song = JSON.parse(sessionStorage.getItem('singersongs'))[id]
    } else {
        song = JSON.parse(sessionStorage.getItem('listsongs'))[id]
    }
    var tr = '<li class="list-group-item bg-ligth text-black-50" id=a' + id + ' data-id=' + id + ' index=' + total + '>' + song.name + ' -' + song.singer + ' /' +
        song.time + ' <span class = "badge bg-secondary del float-end " > x </span></li> '
    $('.meun ul').append(tr);
    $('.count.badge').html($('.meun ul li').length - 1)
};
//歌曲搜索

async function checksong(id) {
    await $.get('https://mu-two.vercel.app/check/music?id=' + id, e => {
        return e.message;
    })
}
// 
//搜索功能
//
function serchSongs(keywords) {

    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/cloudsearch?keywords=' + keywords + '&limit=100', e => {
            v(e);
        });
    })
    return p;
}

function getSong(data, name = 'songs2') {
    let p = new Promise((v, f) => {
        // console.log(data)
        var songs = [];
        var songs2 = {};
        var k = 0;
        for (let x of data) {
            k++;
            var song = {};
            time = x.dt;
            song.time = timeFormat(time, 0, 1)
            song.id = x.id;
            song.fee = x.fee;
            song.al = x.al.name;
            song.index = k;
            for (let j of x.ar) {
                song.singerID = j.id;
                break;
            }
            song.name = x.name;
            song.pic = x.al.picUrl;
            for (let y of x.ar) {
                song.singer += y.name + '/'
            }
            song.singer = song.singer.replace('undefined', '').replace(/\/$/g, '');
            songs.push(song)
            songs2[song.id] = song;
        }
        v(songs2)
        sessionStorage.setItem(name, JSON.stringify(songs2))
    });
    return p;
}

function serch(keywords) {
    serchSongs(keywords).then(data => {
        return getSong(data.result.songs);

    }).then(data => {
        // $('.load2').addClass('waiting')
        for (let x in data) {
            var song = songList(data[x], 1 + eval(x));
            $('#musicPool tbody').append(song)
        }
    });
};
//tbody
var load2 = "";
load2 += "<div class=\"load2\">";
load2 += "<span class=\"loading\"><\/span>";
load2 += "<span class=\"loading\"><\/span>";
load2 += "<span class=\"loading\"><\/span>";
load2 += "<span class=\"loading\"><\/span>";
load2 += "<span class=\"loading\"><\/span>";
load2 += "<span class=\"loading\"><\/span>";
load2 += "<\/div>";
//定义song
function songFn(data, name) {
    var songs = [];
    var songs3 = {};
    var k = 0;
    for (let x of data) {
        k++;
        var song = {};
        time = x.bMusic.playTime;
        song.index = k;
        song.time = timeFormat(time, 0, 1)
        song.size = x.bMusic.size + "kb";
        song.id = x.id;
        song.singerID = x.artists[0].id;
        song.fee = x.fee;
        song.al = x.album.name;
        song.name = x.name;
        song.pic = x.album.blurPicUrl;
        song.url = x.mp3Url;
        song.singer = x.artists[0].name;
        songs.push(song)
        songs3[song.id] = song;
    }
    sessionStorage.setItem(name, JSON.stringify(songs3))
    return songs3;
}

//解析歌词成数组
function lyrics(id) {
    var lrURL = domain + '/lyric?id=' + id;

    function p2(x) {
        let p = new Promise((v, f) => {
            $.post(x, e => {
                v(e);
            });
        })
        return p;
    }
    p2(lrURL).then(e => {
        var lyric = JSON.stringify(e.lrc.lyric)
        var lyrics = {};
        var lyrics_time = [];
        var lyrics_words = [];
        var times = lyric.match(/([0-9\.:]{7,9}|(?<=]).*?(?=\\))/g);
        for (let x in times) {
            if (x % 2 == 0) {
                lyrics[Math.floor(x / 2)] = [timeFormat(times[x]), times[eval(x) + 1]]
            }
        }
        sessionStorage.setItem('lyric', JSON.stringify(lyrics))
    })
}
//获取歌手top音乐
function singerSongs(singerID) {
    sessionStorage.removeItem('singerSongs');
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/artist/top/song?id=' + singerID, e => {
            v(e);
        });
    }).then(e => {

        getSong(e.songs, 'singersongs').then(e => {
            console.log(e)
            for (let x in e) {
                var infor = $('<span class="mx-3"></span>').html(e[x].name + '-' + e[x].singer + '/' + e[x].al);
                var img = $('<img >').attr('src', e[x].pic);
                var li = $('<li></li>').append(img, infor);
                li.attr('data-id', x)
                $('ul.similar').append(li);
            }
        });

    })
}
// singerSongs(6452)
//获取歌手mv
function getMV(singerID) {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/artist/mv?id=' + singerID, e => {
            v(e);
        });
    }).then(e => {
        // console.log(e)
        var mvlist = {};
        let p = new Promise((v, f) => {
            var k = e.mvs;
            for (let x in k) {
                var mvs = {}
                mvs.id = k[x].id;
                mvs.pic = k[x].imgurl;
                mvs.singer = k[x].artistName;
                mvs.name = k[x].name;
                mvs.publish = k[x].publishTime;
                mvs.playcount = k[x].playCount;
                mvlist[mvs.id] = mvs;
            }
            v(mvs);
            sessionStorage.setItem('mvlist', JSON.stringify(mvlist))
        })
        return p;
    }).then(data => {
        var e = JSON.parse(sessionStorage.getItem('mvlist'));
        for (let x in e) {
            var infor = $('<span class="mx-3"></span>').html(e[x].name + '-' + e[x].singer + '/' + e[x].publish);
            var img = $('<img >').attr('src', e[x].pic);
            var li = $('<li data-bs-toggle="offcanvas" data-bs-target="#mvplayer"></li>').append(img, infor);
            li.attr('data-id', x)
            $('ul.mv').append(li);
        }
    })

}
//打开mv
function openMV(mvid) {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/mv/url?id=' + mvid, e => {
            v(e.data.url);
        });
    })
    return p;
}
//播放初始化

function playerReset() {
    $('ul.similar li:gt(0)').remove();
    $('ul.mv li:gt(0)').remove();
    $('ul.mv-player li:gt(0)').remove();
    $('.words').html(words_rest);
    $('.detail').html(detail_rest);
    $('.xx').html(nowlric_rest);
    $('.comment ol').empty();
}
//评论条
function songComment(id) {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/comment/music?id=' + id + '&limit=2', e => {
            v(e);
            // console.log(e.hotComments)
            var comments = [];

            for (let x of e.hotComments) {
                var com = {};
                com.name = x.user.nickname;
                com.pic = x.user.avatarUrl;
                com.time = x.timeStr;
                com.like = x.likedCount;
                com.content = x.content;
                comments.push(com)
            }
            v(comments)
                // console.log(comments)
            for (let x of comments) {
                // console.log(commentStr(x).get(0))
                $('.comment ol').append(commentStr(x));
            }
        });
    })
}

function commentStr(comment) {
    var li = $('<li></li>');
    var img = $('<img>').attr('src', comment.pic);
    var p1 = $('<p></p>').addClass('sp')
    span11 = $('<span class="speaker"></span>').html(comment.name + ':');
    span12 = $('<span></span>').html(comment.content)
    p1.append(span11, span12);
    var p2 = $('<p></p>').addClass('tim');
    span21 = $('<span class="float-start"></span>').html(comment.time);
    span22 = $('<span class="float-end px-1"> | <span class="back"> 回复 </span> </span >').prepend($('<i class="iconfont icon-good text-primary"></i>').html(comment.like));
    p2.append(span21, span22);
    li.append(img, p1, p2);
    return li;
}
// songComment(186016)

//推荐歌单
function listsRecommand() {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/personalized?limit=50', e => {
            var lists = [];
            for (let x of e.result) {
                var com = {};
                com.name = x.name;
                com.id = x.id;
                com.pic = x.picUrl;
                com.playCount = Math.floor(x.playCount / 10000) + '万';
                lists.push(com)
            }
            v(lists);
            $('.s0 li').remove();
            for (let x of lists) {
                $('.s0').append(reommandStr(x));
            }
        });
    })
}

function reommandStr(list) {
    var li = $('<li></li>');
    li.attr('data-id', list.id)
    var p = $('<p></p> ').html(list.name);
    var div = $('<div class="port "></div>');
    img = $('<img>').attr('src', list.pic)
    infor = $('<div class="infor "><div class="s2"><i class="iconfont icon-circle-next"></i></div></div>').prepend($(' <div class="s1"></div>').append($('<i class="iconfont icon-music"></i>').html(list.playCount)))
    div.append(img, infor);
    li.append(div, p)
    return li;
}
//获取歌单详情
function getReclists(listid) {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/playlist/detail?id=' + listid, e => {
            var lists = [];
            listcont = {
                'listname': e.playlist.name,
                'listpic': e.playlist.coverImgUrl,
                'listback': e.playlist.subscribedCount,
                'listupdate': new Date(e.playlist.updateTime).format("YYYY-MM-DD"),
                'listmore': e.playlist.description
            };
            lists.push(listcont);
            sessionStorage.setItem('listsongs_cont', JSON.stringify(listcont));
            var songss = '';
            var ids = [];
            for (let x of e.playlist.trackIds) {
                ids.push(x.id)
                songss += ',' + x.id;
            };
            v(songss.substr(1))
        });
    }).then(e => {
        var q = new Promise((v, f) => {
            $.get('https://mu-two.vercel.app/song/detail?ids=' + e, data => {
                getSong(data.songs, 'listsongs').then(a => {
                    var listcont = JSON.parse(sessionStorage.getItem('listsongs_cont'));
                    $('tbody').empty();
                    $('tbody').append(load2)
                    for (let x in a) {
                        var song = songList(a[x], 1 + eval(x));
                        $('#musicPool tbody').append(song)
                    }
                    $('#musicPool').slideDown();
                    $('#musicPool h5').html(listcont.listname).attr('title', listcont.listmore) //(listcont.listmore));
                })
            })
        })
    })
};
/*
*：推荐歌曲
?：
!：
TODO:
@param:
*/
function songsRecommand() {
    var url = 'https://mu-two.vercel.app/recommend/songs';
    $('iframe').attr('src', url)
    $.get(url, e => {
        var songs = (e.data.dailySongs);
        getSong(songs, 'songsRecommend').then(a => {
            for (let x in a) {

                var song = songList(a[x], 1 + eval(x));
                $('.s2 button').hide();
                $('.s2 tbody').append(song)
            }

        })
    })
};