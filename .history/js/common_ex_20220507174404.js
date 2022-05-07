///////////////////////////////////////////////////////////////
//-------------------------ajax----------------------------
///////////////////////////////////////////////////////////////
function ajax(URL) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function() {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}
// var a = URL;
// ajax(a).then(function onFulfilled(value) {
//     console.log('内容是：' + value);
// }).catch(function onRejected(error) {
//     console.log('错误：' + error);
// });

//日期格式化
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };

    //  获取年份 
    // ①
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        // ②
        if (new RegExp("(" + k + ")", "i").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

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
    // console.log(m + ':' + s)
    return m + ':' + s;


}
// timeFormat('2:2.252',5)
//测试ajax函数
function testURL(url, data) {
    $.get(url, data => {
        return datda;
    })
}