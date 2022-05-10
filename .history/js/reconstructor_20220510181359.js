class userData {
    constructor(phone, password, ele) {
        this.user = {
            phone: phone || '',
            password: password || ''
        };
        this.init();
        this.initEle = ele;
    }
    init() {

    }
    vars = {
        musicApi: 'https://mu-two.vercel.app',
        localURL: window.location.href,
        listsID: [19723756, 2581118464, 2884035]

    }

    component_reset = {
        words_rest: '<p class="l1">---</p><p class="l2">---:</p><p class="l3 active">正在播放</p><p class="l4">---</p><p class="l5">---</p>',
        detail_rest: '<span>歌曲</span><span class="singer  text-light">-歌手</span><span class="album  text-light">-专辑</span>',
        nowlric_rest: '---歌词---',
    }
    userAccount() {
        let p = new Promise((v, f) => {
            $.get('https://mu-two.vercel.app/user/account', e => {
                try {
                    // e = JSON.parse(e);
                    var user = {};
                    user.id = e.profile.userId;
                    user.name = e.profile.nickname;
                    user.pic = e.profile.avatarUrl;
                    user.bg = e.profile.backgroundUrl;
                    user.status = e.account.status;
                    v(user)
                } catch (error) {
                    alert("请检查登录情况！")
                }

            })
        })
        return p;
    }
    login(phone, password) {
        this.user = {
            phone: phone || '',
            password: password || ''
        };
        this.submit();
    }
    submit() {
        var user0 = this.user;
        console.log('a', user0);
        var fn = this.fn;
        let p = new Promise(() => {
            $.ajax({
                //请求方式
                type: "GET",
                url: "https://mu-two.vercel.app/login/cellphone",
                //数据，json字符串
                data: user0,
                //请求成功
                success: function(result) {
                    console.log('b', result);
                    if (result.loginType === 1) {
                        alert('登录成功！');
                        var e = result;
                        var user = {};
                        user.id = e.profile.userId;
                        user.name = e.profile.nickname;
                        user.pic = e.profile.avatarUrl;
                        user.bg = e.profile.backgroundUrl;
                        user.status = e.account.status;
                        user.phone = user0.phone;
                        user.password = user0.password;
                        user0 = user;
                        fn.setCookie('userData', JSON.stringify({ user: user0, status: '1' }), 1);
                        document.location.reload();
                    } else {
                        alert('请检查账号/密码是否正确！')
                    }
                },
                //请求失败，包含具体的错误信息
                error: function(e) {
                    console.log(e.status);
                    alert('请检查账号/密码是否正确！')
                }
            })
        })
        return p;
    }
    checkCookie(key) {
        var data = this.fn.getCookie(key);
        return data ? true : false;
    }
    fn = {
        setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        //查找cookie
        getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        },
        timeFormat(time, n = 0) {
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
            // console.log(m + ':' + s)
            return m + ':' + s;
        }


    }
}
class song extends userData {

    getIDs(idslist) {
        var ids = '';
        for (let x in idslist) {
            ids += ',' + idslist[x].id;
        };
        return ids.substr(1)
    }
    SongFormat(data) {
        let p = new Promise((v, f) => {
            // console.log(data)
            var songs = [];
            var songs2 = {};
            var k = 0;
            for (let x in data) {
                k++;
                var song = {};
                var time = data[x].dt;
                song.time = this.fn.timeFormat(time, 0, 1)
                song.id = data[x].id;
                song.fee = data[x].fee;
                song.al = data[x].al.name;
                song.index = k;
                for (let j of data[x].ar) {
                    song.singerID = j.id;
                    break;
                }
                song.name = data[x].name;
                song.pic = data[x].al.picUrl;
                for (let y of data[x].ar) {
                    song.singer += y.name + '/'
                }
                song.singer = song.singer.replace('undefined', '').replace(/\/$/g, '');
                songs.push(song)
                songs2[song.index] = song;
            }
            v(songs2)
                // sessionStorage.setItem(name, JSON.stringify(songs2))
        });
        return p;
    }
    getSonglists(listid) {
        var q = new Promise((v, f) => {
            $.get('https://mu-two.vercel.app/song/detail?ids=' + listid, data => {
                // console.log('x', data);
                this.SongFormat(data.songs).then(e => {
                    v(e)
                })
            })
        })
        return q;
    };
    getSongComment(id, limit = 3) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/comment/music?id=' + id + '&limit=' + limit, e => {
                var hots = [];
                for (let x of e.hotComments) {
                    var com = {};
                    com.name = x.user.nickname;
                    com.pic = x.user.avatarUrl;
                    com.time = x.timeStr;
                    com.like = x.likedCount;
                    com.content = x.content;
                    hots.push(com)
                }
                var news = [];
                for (let x of e.comments) {
                    var com = {};
                    com.name = x.user.nickname;
                    com.pic = x.user.avatarUrl;
                    com.time = x.timeStr;
                    com.like = x.likedCount;
                    com.content = x.content;
                    news.push(com)
                }
                v({ hots: hots, news: news })
            });
        })
        return p;
    }
    getSingerMv(id) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/artist/mv?id=' + id, e => {
                var mvlist = {};
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
                v(mvlist);
            });
        })
        return p;
    }
    getSingerSong(singerID) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/artist/top/song?id=' + singerID, e => {
                var lists = this.SongFormat(e.songs)
                v(lists)
            });
        })
        return p;
    }
    getListDiscription(listid) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/playlist/detail?id=' + listid, e => {
                var ids = this.getIDs(e.playlist.trackIds);
                var listcont = {
                    'id': listid,
                    'listname': e.playlist.name,
                    'listpic': e.playlist.coverImgUrl,
                    'listback': e.playlist.subscribedCount,
                    'listupdate': new Date(e.playlist.updateTime).format("YYYY-MM-DD"),
                    'listmore': e.playlist.description,
                    'ids': ids
                };
                v(listcont)
            });
        })
        return p;
    }
    getListAll(listid) {
        let p = new Promise((v, f) => {
            this.getListDiscription(listid).then(e => {
                // console.log('a', e.ids);
                this.getSonglists(e.ids).then(x => {
                    v({ dis: e, songs: x })
                })
            })
        })
        return p;
    }
    getMvURL(mvid) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/mv/url?id=' + mvid, e => {
                v(e.data.url);
            });
        })
        return p;
    }
    getSongURL(id) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/song/url?id=' + id, e => {
                v(e.data[0].url ? e.data[0].url : ' https://music.163.com/song/media/outer/url?id=' + id + '.mp3');
            });
        })
        return p;
    }
    getSongLyrics(songID) {
        var lrURL = this.vars.musicApi + '/lyric?id=' + songID;
        let p = new Promise((v, f) => {
            $.post(lrURL, e => {
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
                v(lyrics)
            });
        })
        return p;
    }
    serchSongs(keywords, limit = 30) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/cloudsearch?keywords=' + keywords + '&limit=' + limit, e => {
                this.SongFormat(e.result.songs).then(e => {
                    v(e)
                });

            });
        })
        return p;
    }
    hotSingersSort(type = 1) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/toplist/artist?type=' + type, e => {

                var lists = {}
                e.list.artists.map((e, i) => {
                    var singer = {
                        id: e.id,
                        name: e.name,
                        pic: e.picUrl,
                        albumSize: e.albumSize,
                        musicSize: e.musicSize,
                        score: e.score
                    };
                    lists[i] = singer;
                })
                v(lists)
            });
        })
        return p;
    }
    hotMvSort() {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/top/mv', e => {
                var lists = {}
                e.data.map((e, i) => {
                    var mv = {
                        id: e.id,
                        name: e.name,
                        pic: e.cover,
                        playCount: e.playCount,
                        briefDesc: e.briefDesc,
                        singer: e.artistName
                    };
                    lists[i] = mv;
                })
                v(lists)
            });
        })
        return p;
    }
    hotMvNew() {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/mv/first', e => {
                var lists = {}
                e.data.map((e, i) => {
                    var mv = {
                        id: e.id,
                        name: e.name,
                        pic: e.cover,
                        playCount: e.playCount,
                        briefDesc: e.briefDesc,
                        singer: e.artistName
                    };
                    lists[i] = mv;
                })
                v(lists)
            });
        })
        return p;
    }
    hotSongsSort(index = 1) {
        var self = this;
        let p = new Promise((v, f) => {
            this.getListAll(self.vars.listsID[index]).then(e => {
                v(e)
            })
        })
        return p;
    }
    playCheck(id) {
        var url = 'https://mu-two.vercel.app/check/music?id=' + id;
        let p = new Promise((v, f) => {
            $.get(url, e => {
                v(e.success);
            })
        })
        return p;
    };
    getSingerDetail(id) {
        var url = 'https://mu-two.vercel.app/artist/detail?id=' + id;
        let p = new Promise((v, f) => {
            $.get(url, e => {
                var data = e.data;
                var singer = {
                    id: data.artist.id,
                    pic: data.artist.cover,
                    name: data.artist.name,
                    transNames: data.artist.transNames[0],
                    briefDesc: data.artist.briefDesc,
                    rank: data.artist.rank,
                    albumSize: data.artist.albumSize,
                    musicSize: data.artist.musicSize,
                    mvSize: data.artist.mvSize
                }
                v(singer);
            })
        })
        return p;
    }
}
class personSong extends song {
    userListsRecommand(num = 30) {
        let p = new Promise((v, f) => {
            $.post('https://mu-two.vercel.app/personalized?limit=' + num, e => {
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
            });
        })
        return p;
    }
    userSongLists(userid) {
        let p = new Promise((v, f) => {
            $.get(this.vars.musicApi + '/user/playlist?uid=' + userid, e => {
                var lists = {};
                var data = e.playlist;
                for (let x in data) {
                    var list = {};
                    list.pic = data[x].creator.avatarUrl;
                    list.bg = data[x].coverImgUrl;
                    list.name = data[x].name;
                    list.id = data[x].id;
                    list.num = data[x].trackCount
                    lists[list.id] = list;
                }
                v(lists)
            })
        })
        return p;

    }
    userSongsReccommand() {
        let p = new Promise((v, f) => {
            var url = 'https://mu-two.vercel.app/recommend/songs';
            try {
                $.get(url, e => {
                    var data = this.SongFormat(e.data.dailySongs)
                    v(data)
                })
            } catch (error) {
                alert("请检查登录情况！")
            }
        })
        return p;

    }
    userLevel() {
        var url = 'https://mu-two.vercel.app/user/level';
        let p = new Promise((v, f) => {
            $.get(url, e => {
                v(e.data.level);
            })
        })
        return p;
    }
    userStatus() {
        var url = 'https://mu-two.vercel.app/login/status';
        let p = new Promise((v, f) => {
            $.get(url, e => {
                v(e.data.account ? 1 : 0);
            })
        })
        return p;
    }
    userLogout() {
        url = 'https://mu-two.vercel.app/logout'
        $.get(url)
    }
    init() {
        sessionStorage.setItem('all', JSON.stringify({}));
        new Promise((v, f) => {
            $('.main_cont tbody').append(load2)
            this.hotSongsSort(0).then(f => {
                v(f)
                allSave('hotSongsSort', f)
            });
        }).then(a => {
            $('.main_cont tbody').empty();
            $('.main_cont tbody').attr('type', 'song');
            var e = a.songs;
            for (let x in e) {
                var song = songList(e[x], eval(x));
                $(this.initEle).append(song)
            }
        })

    }

}

//all存储
function allSave(key, data) {
    var all = JSON.parse(sessionStorage.getItem('all'));
    all[key] = data;
    sessionStorage.setItem('all', JSON.stringify(all))
}