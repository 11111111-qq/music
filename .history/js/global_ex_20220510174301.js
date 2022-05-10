//登录
//
//登录检查
//
function loginCheck() {

    $('.notlogin').css('display', 'flex')
    $('.login').css('display', 'none')
    var user = getCookie('userData');
    if (user) {
        $('.notlogin').css('display', 'none')
        $('.login').css('display', 'flex')

        user = JSON.parse(user).user;
        // console.log(user)
        $('.offcanvas-body.login').css('background', 'whitesmoke').css('background-size', 'cover');
        $('.login img').attr('src', user.pic)
        $('.login .infor .nameid').html('id:' + user.id)
        $('.login .infor .name').html(user.name);
        userlists(user.id)
        $('.nav-link img').attr('src', user.pic).css('border-radius', '50%').addClass('shadow')
    }

}


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
function checkCookie(key) {
    var data = getCookie(key);
    return data ? true : false;
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
//歌手list
function singerList(singer, index) {
    var tr = $('<tr></tr>');
    tr.attr('data-id', singer.id)
    var td1 = $('<td>' + index + '</td>');
    var td2 = $('<td><img><span></span><span></span><i></i></td>')
    td2.children('img').attr('src', singer.pic).attr('data-id', singer.id);
    td2.children('i').attr('class', "iconfont icon-circle-next mx-1").attr('data-id', singer.id);
    td2.children('span').eq(0).attr('class', 'song').html(singer.name).attr('data-id', singer.id);
    td2.children('span').eq(1).attr('class', 'res').html('专辑：' + singer.albumSize).attr('data-id', singer.id);
    var td3 = $('<td>' + '歌曲：' + singer.musicSize + '</td>')
    var td4 = $('<td>' + '热度：' + singer.score + '<i class="iconfont icon-add mx-2 my-2 "></i></td>')
    td1.attr('data-id', singer.id);
    td2.attr('data-id', singer.id);
    td3.attr('data-id', singer.id).attr('data-time', singer.name).attr('class', 'dataTime');
    td4.attr('data-name', singer.name).attr('class', 'dataName').attr('data-id', 'a' + singer.id);
    tr.append(td1, td2, td3, td4);
    return tr;
}
//mvlist
function mvList(singer, index) {
    var tr = $('<tr data-bs-toggle="offcanvas" data-bs-target="#mvplayer"></tr>');
    tr.attr('data-id', singer.id)
    var td1 = $('<td>' + index + '</td>');
    var td2 = $('<td><img><span></span><span></span><i></i></td>')
    td2.children('img').attr('src', singer.pic).attr('data-id', singer.id);
    td2.children('i').attr('class', "iconfont icon-circle-next mx-1").attr('data-id', singer.id);
    td2.children('span').eq(0).attr('class', 'song').html(singer.name).attr('data-id', singer.id);
    td2.children('span').eq(1).attr('class', 'res').html('歌手：' + singer.singer).attr('data-id', singer.id);
    var td3 = $('<td>' + '点击：' + singer.playCount + '</td>')
    if (!singer.briefDesc) {
        singer.briefDesc = '--';
    }
    var td4 = $('<td>' + singer.briefDesc + '</td>')
    td1.attr('data-id', singer.id);
    td2.attr('data-id', singer.id);
    td3.attr('data-id', singer.id).attr('data-time', singer.name).attr('class', 'dataTime');
    td4.attr('data-name', singer.name).attr('class', 'dataName').attr('data-id', 'a' + singer.id).css('max-width', '100px');
    tr.append(td1, td2, td3, td4);
    return tr;
}
//meun
function addMeun(song) {
    id = song.id;
    var total = $('.meun ul li').length;
    var song;

    var tr = '<li class="list-group-item bg-ligth text-black-50" id=a' + id + ' data-id=' + id + ' index=' + total + '>' + song.name + ' -' + song.singer + ' /' +
        song.time + ' <span class = "badge bg-secondary del float-end " > x </span></li> '
    $('.meun ul').append(tr);
    $('.count.badge').html($('.meun ul li').length - 1)
};


//tbody


//解析歌词成数组
function lyrics(id) {
    app.getSongLyrics(id).then(e => {
        allSave('lyrics', e)
    })
}
//获取歌手top音乐
function singerSongs(singerID) {
    app.getSingerSong(singerID).then(e => {
        for (let x in e) {
            var infor = $('<span class="mx-3"></span>').html(e[x].name + '-' + e[x].singer + '/' + e[x].al);
            var img = $('<img >').attr('src', e[x].pic);
            var li = $('<li></li>').append(img, infor);
            li.attr('data-id', e[x].id)
            $('ul.similar').append(li);
        }
        allSave('singerSongs', e)
    })
}
// singerSongs(6452)
//获取歌手mv
function getMV(singerID) {
    app.getSingerMv(singerID).then(e => {
        allSave('mvlist', e);
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
    app.getSongComment(id, 20).then(e => {
        for (let x of e.hots) {
            $('.comment ol').append(commentStr(x));
        }
    })
}

function commentStr(comment) {
    var li = $('<li></li>');
    var img = $('<img>').attr('src', comment.pic);
    var p1 = $('<p></p>').addClass('sp')
    span11 = $('<span class="speaker"></span>').html(comment.name + ':');
    span12 = $('<span></span>').html(comment.content).attr('title', comment.content);

    p1.append(span11, span12);
    var p2 = $('<p></p>').addClass('tim');
    span21 = $('<span class="float-start"></span>').html(comment.time);
    span22 = $('<span class="float-end px-1"> | <span class="back"> 回复 </span> </span >').prepend($('<i class="iconfont icon-good text-primary"></i>').html(comment.like));
    p2.append(span21, span22);
    li.append(img, p1, p2);
    return li;
}
// songComment(186016)



function reommandStr(list, name = 'listsongs_cont') {
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
//获取歌手详情
function singerDetailStr(id, ele) {

    app.getSingerDetail(id).then(e => {
        var cont = $(ele);
        var img = $('<img>').attr('src', e.pic);
        var h4 = $('<h4></h4>').thml(e.name);
    })

}
//用户歌单
function userlists(userid) {
    app.userSongLists(userid).then(e => {
        allSave('userSongLists', e);
        wyy();
    })

}
//构造网易云盒子
function wyy() {
    var lists = JSON.parse(sessionStorage.getItem('all')).userSongLists;
    var n = lists.length;
    // console.log(lists)
    for (let x in lists) {
        var name = lists[x].name;
        var songcount = lists[x].num;
        var id = lists[x].id;
        var div = $(' <div class="list1" ><span class="s1"></span><span class="a1" style="color:rgba(45,45,45,.4)"></span></div>').attr('data-id', id);
        div.find('.s1').html(name);
        div.find('.a1').html('(' + songcount + '首)')
            // console.log(div)
        $('.wyy').append(div);
    }
}