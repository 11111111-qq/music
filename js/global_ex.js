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

//歌曲搜索

async function check(id) {
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

function getSong(data) {
    let p = new Promise((v, f) => {
        // console.log(data)
        var songs = [];
        var songs2 = {};
        for (let x of data.result.songs) {
            var song = {};
            time = x.dt;
            song.time = timeFormat(time, 0, 1)
            song.id = x.id;
            song.fee = x.fee;
            song.al = x.al.name;
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
        v(songs)
        sessionStorage.setItem('songs2', JSON.stringify(songs2))
    });
    return p;
}

function serch(keywords) {
    serchSongs(keywords).then(data => {
        return getSong(data);

    }).then(data => {
        $('.load2').addClass('waiting')
        for (let x in data) {
            var song = songList(data[x], 1 + eval(x));

            $('.main tbody').append(song)
        }
    });
};
//时间格式化
function timeFormat(time, n = 0) {
    var m, s;
    var count = Math.pow(10, n);
    if (typeof time == "number") {
        m = Math.floor(time / 1000 / 60);
        s = Math.round((time / 1000 % 60) * count) / count;
    } else {
        m = time.split(':')[0];
        s = time.split(':')[1];
        s = Math.round(s * count) / count;
    }
    m = String(m);
    s = String(s);
    if (m.length == 1) {
        m = '0' + m;
    }
    if (Number(m) > 59) {
        m = Math.floor(m / 60) + ':' + (m % 60)
    }
    if (s.length == 1) {
        s = '0' + s;
    }
    s = String(s);
    if (s.includes('.')) {
        s1 = s.split('.')[0];
        s2 = s.split('.')[1];
        if (s2.length < n) {
            var j = n - s2.length;
            for (let i = 1; i <= j; i++) {
                s2 += '0'
            }
        }
        s = s1 + '.' + s2;
    } else {
        if (n != 0) {
            s = s + '.';
            for (let i = 1; i <= n; i++) {
                s += '0'
            }
        }

    }
    return m + ':' + s;
}
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
//相似歌曲
function getSimSongs(id) {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/simi/song?id=' + id + '&limit=100', e => {
            v(e);
        });
    })
    return p;
}

function simsongs(id) {
    let q = getSimSongs(id).then(data => {
        let p = new Promise((v, f) => {
            var songs = [];
            var songs3 = {};
            for (let x of data.songs) {
                var song = {};
                time = x.bMusic.playTime;
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
            sessionStorage.setItem('songs3', JSON.stringify(songs3))
            v(songs3);
        })
        return p;
    })
    return q;
};

//获取歌手mv
function getMV(singerID) {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/artist/mv?id=' + singerID, e => {
            v(e);
        });
    }).then(e => {
        console.log(e)
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
openMV(5436712)