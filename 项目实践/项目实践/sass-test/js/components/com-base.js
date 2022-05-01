//初步组件1
class aBase {
    constructor(config) {
        // console.log(this.constructor.prototype)
        this.config = config;
        this.init();

        this.id = config.id;
        this.style = config.style || '0'
        this.positon = config.positon || 'after'
        this.obj = document.querySelector(config.id) || document.querySelector('body');
        switch (this.positon) {
            case ('before'):
                this.positon = 'beforebegin';
                break;
            case 'after':
                this.positon = 'afterend';
                break;
        }
        // console.log(this.type)

        this.styleSet();
        this.bind();
        this.render();
        return this;
    }
    init() {
        this.type = this.config.type || '';
    }
    getObj() {
        return [this.obj, this.nowEle];
    }

    //设置更改
    get(x) {
        return this.config[x];
    }
    set(x, y) {
            this.config[x] = y;
            this.styleSet();
            this.render();
        }
        //设置内部监听
        //对象属性对应索引号
    _indexOf(array, key) {
        var i = -1;
        for (var x in array) {
            i += 1
            if (x == key) return i
            return -1
        }
    }

    //绑定触发key与事件
    on(_key, _listener) {

            //this.__events存储所有的处理函数
            if (!this._events) {
                this._events = {}
            }
            if (!this._events[_key]) {
                this._events[_key] = null;
            }

            if (this._indexOf(this._events, _listener) === -1 && typeof _listener === 'function') {
                this._events[_key] = _listener;
            }
            // console.log(this._events)
            return this
        }
        //触发一个事件，也就是通知
    fire(_key) {


            if (!this._events || !this._events[_key]) return
            var args = Array.prototype.slice.call(arguments, 1) || []
            var _listeners = this._events[_key]
            _listeners.apply(null, args)
            return this
        }
        //取消监听
    off(_key, _listener) {
            if (!_key && !_listener) {
                this._events = {}
            }
            //不传监听函数，就去掉当前_key下面的所有的监听函数
            if (_key && !_listener) {
                delete this._events[_key]
            }
            if (_key && _listener) {
                //删除特定属性
                Reflect.deleteProperty(this._events, _key)
            }
            return this;
        }
        //绑定事件与监听
    bind(event, fn) {
            try {
                var e0 = this;
                e0.obj.addEventListener(event, () => {
                    // this.render();
                    fn ? fn() : '';
                }, false);
            } catch (error) {
                console.log(error)
            }

        }
        //渲染
    render() {
        var eg = this.example(this.type);
        var jst = false;
        var egs = document.querySelectorAll('[class^=' + this.type + ']');
        for (var ele of egs) {
            if (ele.className.indexOf(this.id) != -1) {
                jst = true;
                break;
            }
        }
        // console.log(egs.length)

        var cEle = null;

        switch (this.positon) {
            case 'afterend':
                if (!this.obj.nextElementSibling) break;
                cEle = this.obj.nextElementSibling.className.indexOf(this.type) != -1 ? this.obj.nextElementSibling : null;
                break;
            case 'beforebegin':
                if (!this.obj.previousElementSibling) break;

                cEle = this.obj.previousElementSibling.className.indexOf(this.type) != -1 ? this.obj.nextElementSibling : null;
                break;
            case 'afterbegin':
                if (!this.obj.parentElement.firstChild) break;

                cEle = this.obj.parentElement.firstElementChild.className.indexOf(this.type) != -1 ? this.obj.nextElementSibling : null;
                break;
            case 'beforeend':
                if (!this.obj.parentElement.lastChild) break;
                cEle = this.obj.parentElement.lastElementChild.className.indexOf(this.type) != -1 ? this.obj.nextElementSibling : null;
                break;
        }
        // console.log(cEle)

        if (cEle && jst == true) {
            // alert(1)
            this.nowEle = cEle;
        } else if (jst == false) {
            // alert(2)
            if (typeof eg == 'string') {
                this.nowEle = document.createElement('div');
                this.nowEle.className = this.type + (egs.length + 1);
                this.nowEle.innerHTML = eg;
            } else {
                this.nowEle = eg();
            }
            this.obj.insertAdjacentElement(this.positon, this.nowEle);
            this.nowEle.className = this.type + egs.length + '_' + this.id;
            this.nowEle.style = this.defaultStyle;
        }
        2
        // console.log(this.nowEle)

        let self = this;
        //加载type的特定事件
        self.egEvent(self.type, self.nowEle, self)();
    }
    destroy() {
            this.off();
        }
        ////////////////////////////

    //设置模板
    styleSet() {
        switch (this.style) {

        }
    }
    example(type) {
        var pre = {}
        return pre[type]
    }
    egEvent(type, nowEle, self) {
            var pre = {}
            return pre[type]
        }
        //////////////////////////
}
// -- -- -- -- -- -- -- -- -- -- -- 测试拓展组件区

//组件1：文本计数
class inputCount extends aBase {
    init() {
        this.type = 'inputCount'
    }
    example(type) {
        var pre = {
            inputCount: '<span class= "inputCount" >00</span>',
        }
        return pre[type]
    }
    egEvent(type, nowEle, self) {
        var pre = {
            inputCount: function() {
                nowEle.style.display = 'inline-block';
                nowEle.style.width = '20px';
                nowEle.style.textAlign = 'center'
                nowEle.innerHTML = self.getObj()[0].value ? self.getObj()[0].value.length : self.getObj()[0].innerText.length;
            },
        }
        return pre[type]
    }
    styleSet() {
        switch (this.config.style) {
            case '0':
                this.defaultStyle = 'border-radius: 4px;margin:2px;padding:0 2px;\
                border-radius: 5px;\
                background:linear-gradient(145deg, #ff5b34, #e34d2c);\
                color: rgb(255, 255, 255); outline: none '
                break;
            case '1':
                this.defaultStyle = 'border-radius: 4px;margin:2px;padding:0 2px;border-radius: 5px;background-color:rgba(0,0,0,.2)'
                break;
        }
    }
}
// let q2 = new inputCount({
//     id: '#J_input',
//     type: 'inputCount',
//     positon: 'after',
//     style: '0'
// })
// q2.bind('keyup', () => { q2.fire('text1', q2.getObj()[0].innerHTML) })
// q2.on('text1', e => {
//     // console.log(e)
// })



//组件2--箭头盒子
class arrowBox extends aBase {
    init() {
        this.type = 'arrowBox'
    }
    example(type) {
        var strVar = "";
        strVar += "<div class=\"arrow_box\">箭头方框<\/div>";
        strVar += "    <style>";
        strVar += "        .arrow_box {";
        strVar += "            width: 300px;";
        strVar += "            height: 100px;";
        strVar += "            color: white;";
        strVar += "            position: relative;";
        strVar += "            background: #74c5e8;";
        strVar += "            border: 4px solid #c2e1f5;";
        strVar += "            border-radius: 10px;";
        strVar += "            justify-content: center;";
        strVar += "            align-items: center;";
        strVar += "            text-align: center;";
        strVar += "            box-shadow: -2px -20x 20px rgb(231, 223, 223);";
        strVar += "        }";
        strVar += "        ";
        strVar += "        .arrow_box:after,";
        strVar += "        .arrow_box:before {";
        strVar += "            bottom: 100%;";
        strVar += "            left: 50%;";
        strVar += "            border: solid transparent;";
        strVar += "            content: \"\";";
        strVar += "            height: 0;";
        strVar += "            width: 0;";
        strVar += "            position: absolute;";
        strVar += "            pointer-events: none;";
        strVar += "        }";
        strVar += "        ";
        strVar += "        .arrow_box:after {";
        strVar += "            border-color: rgba(116, 197, 232, 0);";
        strVar += "            border-bottom-color: #74c5e8;";
        strVar += "            border-width: 30px;";
        strVar += "            margin-left: -30px;";
        strVar += "        }";
        strVar += "        ";
        strVar += "        .arrow_box:before {";
        strVar += "            border-color: rgba(194, 225, 245, 0);";
        strVar += "            border-bottom-color: #c2e1f5;";
        strVar += "            border-width: 36px;";
        strVar += "            margin-left: -36px;";
        strVar += "        }";
        strVar += "    <\/style>";

        var pre = {
            arrowBox: strVar,
        }
        return pre[type]
    }
    egEvent(type, nowEle, self) {
        var pre = {
            arrowBox: function() {
                try {
                    nowEle.querySelector('.arrow_box').innerHTML = self.getObj()[0].value ? self.getObj()[0].value.length : self.getObj()[0].innerHTML.replace(/\<.+\>/mg, '').length;
                } catch (error) {

                }

            },
        }
        return pre[type]
    }
    styleSet() {
        switch (this.config.style) {
            case '0':
                this.defaultStyle = 'position:absolute;left:' + (this.getObj()[0].getBoundingClientRect().x + 40) +
                    'px;top:' + (this.getObj()[0].getBoundingClientRect().y + 40) + 'px';
                break;
        }
    }
}
// let q3 = new arrowBox({
//         id: '.cs',
//         positon: 'after',
//         style: '0'
//     })
// q3.bind('keyup', () => {
//     console.log(q3.getObj()[0].innerHTML.replace(/\<.+\>/mg, ''))
//     q3.fire('ee', q3.getObj()[0].innerHTML.replace(/\<.+\>/mg, '').length)
// })
// q3.on('ee', e => {
//     e > 5 ? q3.getObj()[1].firstElementChild.innerHTML = '字符数已超过5，请检查；当前字符数：' + e : "";
// })

class ppt extends aBase {
    init() {
        this.type = 'ppt'
        this.data = this.config.imgs || [];
        this.auto = this.config.auto || false;
    }

    example(type) {
        var ppt = "";
        ppt += "<div class=\"ppt\">";
        ppt += "        <div class=\"imgs\">";
        ppt += "        <\/div>";
        ppt += "        <div class=\"num\">";
        ppt += "        <\/div>";
        ppt += "        <div class=\"ctrl\">";
        ppt += "            <div class=\"left\">&lt;<\/div>";
        ppt += "            <div class=\"right\">&gt;<\/div>";
        ppt += "        <\/div>";
        ppt += "        <div class=\"txt\">1\/3<\/div>";
        ppt += "        <style>";
        ppt += "            div[class^='ppt'] {";
        ppt += "                margin: 3px;";
        ppt += "                clear: both;";
        ppt += "                position: relative;";
        ppt += "                width: 310px;";
        ppt += "                height: 120px;";
        ppt += "                box-sizing: border-box;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] img {";
        ppt += "                width: 310px;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .imgs a {";
        ppt += "                position: absolute;";
        ppt += "                opacity: 0;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .imgs a.active {";
        ppt += "                opacity: 1;";
        ppt += "                transition: all ease .8s;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .num {";
        ppt += "                position: absolute;";
        ppt += "                display: flex;";
        ppt += "                width: 100%;";
        ppt += "                bottom: 10px;";
        ppt += "                justify-content: center;";
        ppt += "                align-items: center;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .num div {";
        ppt += "                width: 10px;";
        ppt += "                height: 10px;";
        ppt += "                margin: 0 2px;";
        ppt += "                border-radius: 50%;";
        ppt += "                background-color: #ff5b34;";
        ppt += "                z-index: 2;";
        ppt += "                opacity: .6;";
        ppt += "                cursor: pointer;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .num div.active,";
        ppt += "            div[class^='ppt'] .num div:hover {";
        ppt += "                opacity: 1;";
        ppt += "                transition: all ease .8s;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .txt {";
        ppt += "                position: absolute;";
        ppt += "                padding: 2px;";
        ppt += "                width: 25px;";
        ppt += "                height: 14px;";
        ppt += "                font-size: 10px;";
        ppt += "                line-height: 14px;";
        ppt += "                text-align: center;";
        ppt += "                top: 5px;";
        ppt += "                left: 5px;";
        ppt += "                border-radius: 5px;";
        ppt += "                color: #fff;";
        ppt += "                background-color: rgba(0, 0, 0, .2)";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .ctrl {";
        ppt += "                position: absolute;";
        ppt += "                width: 100%;";
        ppt += "                height: 30px;";
        ppt += "                line-height: 30px;";
        ppt += "                top: calc(50% - 10px);";
        ppt += "                color: white;";
        ppt += "                font-weight: bold;";
        ppt += "                text-align: center;";
        ppt += "                vertical-align: middle;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .ctrl .left {";
        ppt += "                position: relative;";
        ppt += "                float: left;";
        ppt += "                left: 5px;";
        ppt += "                width: 25px;";
        ppt += "                height: 100%;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .ctrl .right {";
        ppt += "                position: relative;";
        ppt += "                float: right;";
        ppt += "                right: 5px;";
        ppt += "                width: 25px;";
        ppt += "                height: 100%;";
        ppt += "            }";
        ppt += "            ";
        ppt += "            div[class^='ppt'] .ctrl div:hover {";
        ppt += "                background-color: rgba(0, 0, 0, .2);";
        ppt += "                border-radius: 5px;";
        ppt += "            }";
        ppt += "        <\/style>";
        return ppt;
    }
    egEvent(type, nowEle, self) {
        var pre = {
            ppt: function() {
                var data = self.data;
                // console.log(data)
                if (data.length == 0) {
                    nowEle.innerHTML = '请初始化数据源：data：···'
                    return;
                }
                // ['../img/66.webp', '../img/67.webp', '../img/68.webp', '../img/69.webp'];
                var imgs = nowEle.querySelector("div[class^='ppt'] .imgs");
                var nums = nowEle.querySelector("div[class^='ppt'] .num");
                for (let x in data) {
                    //生成图片集
                    var xEle = document.createElement('a');
                    var xImg = document.createElement('img');
                    xImg.src = data[x];
                    xEle.appendChild(xImg);
                    imgs.appendChild(xEle);

                    //生成按点集
                    var xN = document.createElement('div');
                    nums.appendChild(xN);

                }
                //生成按钮点击事件
                for (let i = 0; i < data.length; i++)
                    nums.querySelectorAll('div')[i].onclick = () => {
                        showSlides(i)
                    }

                //切换事件
                var _index = 0;
                showSlides(0);
                nowEle.querySelector("div[class^='ppt'] .ctrl .left").onclick = function(e) {
                    _index -= 1;
                    if (_index < 0) {
                        _index = data.length - 1;
                    }
                    showSlides(_index)
                }
                nowEle.querySelector("div[class^='ppt'] .ctrl .right").onclick = function(e) {
                        _index += 1;
                        if (_index == data.length) {
                            _index = 0;
                        }
                        showSlides(_index)
                    }
                    //自动切换计数器
                var timNum = -1;
                var autoS;

                function showSlides(n) {
                    var slideIndex = n;
                    var imgs = nowEle.querySelector("div[class^='ppt'] .imgs");
                    var nums = nowEle.querySelector("div[class^='ppt'] .num");
                    if (slideIndex == data.length) { slideIndex = 0; }
                    if (slideIndex == -1) { slideIndex = data.length - 1; }
                    var i;

                    var slides = imgs.querySelectorAll('a');
                    var dots = nums.querySelectorAll('div');
                    for (i = 0; i < slides.length; i++) {
                        slides[i].className = slides[i].className.replace(" active", "");
                    }
                    for (i = 0; i < dots.length; i++) {
                        dots[i].className = dots[i].className.replace(" active", "");
                    }
                    //错误处理
                    try {
                        slides[slideIndex].className += " active";
                        dots[slideIndex].className += " active";
                        nowEle.querySelector("div[class^='ppt'] .txt").innerHTML = (slideIndex + 1) + '/' + data.length;
                    } catch (error) {}


                    if (self.auto) {
                        autoS = setTimeout(swi, 3000);
                    }

                }

                function swi() {
                    timNum += 1;
                    showSlides(timNum % data.length)
                }

                nowEle.onmouseover = () => {
                    clearTimeout(autoS)
                    self.auto = false;
                };
                nowEle.onmouseout = () => {
                    autoS = setTimeout(swi, 3000);
                    self.auto = true;
                }
            }
        }
        return pre[type]
    }
}
// let cs = new ppt({
//     id: '.cs',
//     imgs: ['../img/66.webp', '../img/67.webp'],
//     style: '2'
// })

//下拉菜单-----------------------------------------------//
class meunDrop extends aBase {
    init() {
        this.type = 'meunDrop'
        this.data = this.config.data;
    }
    example(type) {
        var meun = "";
        meun += "<div class=\"meun\">";
        meun += "";
        meun += "            <style>";
        meun += "                div[class^='meun'] * {";
        meun += "                    padding: 0;";
        meun += "                    margin: 0;";
        meun += "                    list-style: none;";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li {";
        meun += "                    background-color: rgba(255, 255, 255);";
        meun += "                    margin: 4px 0;";
        meun += "                    box-shadow: 1px 1px 1px 2px rgba(241, 241, 241, 0.5);";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li .title,";
        meun += "                div[class^='meun'] li .title.active {";
        meun += "                    position: relative;";
        meun += "                    display: inline-block;";
        meun += "                    width: 100%;";
        meun += "                    height: 40px;";
        meun += "                    font-size: 18px;";
        meun += "                    line-height: 40px;";
        meun += "                    text-transform: capitalize;";
        meun += "                    font-style: italic;";
        meun += "                    color: white;";
        meun += "                    background-color: rgb(0, 195, 126);";
        meun += "                    box-sizing: border-box;";
        meun += "                    padding: 0 20px;";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li .title::before,";
        meun += "                div[class^='meun'] li .title.active::before {";
        meun += "                    display: block;";
        meun += "                    width: 20px;";
        meun += "                    height: 20px;";
        meun += "                    position: absolute;";
        meun += "                    font-size: 16px;";
        meun += "                    font-style: normal;";
        meun += "                    top: 0;";
        meun += "                    right: 5px;";
        meun += "                    z-index: 4;";
        meun += "                    color: #fff";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li .title::before {";
        meun += "                    content: '▼';";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li .title.active::before {";
        meun += "                    content: '▲';";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li section {";
        meun += "                    height: 0;";
        meun += "                    position: relative;";
        meun += "                    width: 80%;";
        meun += "                    margin: 0 auto;";
        meun += "                    overflow: hidden;";
        meun += "                    transition: height .45s ease;";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li section.active {";
        meun += "                    height: 120px;";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li header {";
        meun += "                    font-size: 20px;";
        meun += "                    margin: 6px 0 2px;";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li header::before {";
        meun += "                    content: '■';";
        meun += "                    position: relative;";
        meun += "                    top: -4px;";
        meun += "                    font-size: 16px;";
        meun += "                    width: 20px;";
        meun += "                    height: 20px;";
        meun += "                    color: rgb(0, 195, 126);";
        meun += "                    \/* line-height: 20px;";
        meun += "                    \/* vertical-align: middle; *\/";
        meun += "                }";
        meun += "                ";
        meun += "                div[class^='meun'] li p {";
        meun += "                    font-size: 12px;";
        meun += "                    margin-bottom: 5px;";
        meun += "                }";
        meun += "            <\/style>";
        meun += "         </div>";
        return meun;
    }
    egEvent(type, nowEle, self) {
        var pre = {
            meunDrop: function() {
                console.log(data)
                var data = self.data;

                if (data.length == 0) {
                    alert('请输入菜单数据')
                    return;
                }
                var iOl = document.createElement('ul');
                for (let i = 0; i < data.length; i++) {
                    var iLi = document.createElement('li');
                    var iTitle = document.createElement('p');
                    iTitle.className = 'title'
                    var iSection = document.createElement('Section');
                    var iHeader = document.createElement('header');
                    var iCont = document.createElement('p');
                    iSection.appendChild(iHeader).appendChild(iCont);
                    iSection.appendChild(iCont);
                    iLi.appendChild(iTitle).appendChild(iSection);
                    iLi.appendChild(iSection);

                    //内容
                    iTitle.innerHTML = data[i][0];
                    iHeader.innerHTML = data[i][1];
                    iCont.innerHTML = data[i][2];
                    iOl.appendChild(iLi);
                }
                nowEle.querySelector("div[class^='meun']").appendChild(iOl)
                var titles = nowEle
                    .querySelectorAll("div[class^='meun'] li .title");
                for (let i = 0; i < titles.length; i++) {
                    titles[i].onclick = () => {
                        for (let k = 0; k < titles.length; k++) {
                            if (k == i) {
                                continue;
                            } else {
                                titles[k].parentElement.children[1].className = '';
                                titles[k].className = 'title';
                            }
                        }
                        titles[i].parentElement.children[1].classList.toggle('active');
                        titles[i].classList.toggle('active');
                    }
                }
            }

        }
        return pre[type]
    }
    styleX(sty) {
        if (sty['title']) {
            var titles = this.getObj()[1].querySelectorAll('.title');
            for (let x of titles) {
                x.style = sty['title']
            }
        }
        if (sty['header']) {
            var headers = this.getObj()[1].querySelectorAll('header');
            for (let x of headers) {
                x.style = sty['header']
            }
        }
        if (sty['bg']) {
            var bg = this.getObj()[1].querySelectorAll('li');
            for (let x of bg) {
                x.style = sty['bg']
            }
        }
        if (sty['txt']) {
            var txt = this.getObj()[1].querySelectorAll('section p');
            for (let x of txt) {
                x.style = sty['txt']
            }
        }
        // this.render();
    }
};