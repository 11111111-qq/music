window.yx = {
    g: function(name) { return document.querySelector(name) },
    ga: function(name) { return document.querySelectorAll(name) },
    // 事件兼容
    addEvent: function(obj, ev, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(ev, fn);
        } else {
            obj.attachEvent('on' + ev, fn);
        }
    },
    removeEvent: function(obj, ev, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(ev, fn);
        } else {
            obj.detachEvent('on' + ev, fn);
        }
    },
    public: {
        navFn: function() {
            var nav = yx.g('.nav');
            // console.log(nav)
            var lis = yx.ga('.navBar li');
            // console.log(lis)

            var subNav = yx.g('.subNav');
            // console.log(subNav)

            var uls = yx.ga('.subNav ul');
            console.log(uls)

            var newLis = [] //存储有用的li
            for (var i = 1; i < lis.length - 2; i++) {
                newLis.push(lis[i])
            }
            console.log(newLis)

            for (var i = 0; i < newLis.length; i++) {
                newLis[i].index = uls[i].index = i;
                newLis[i].onmouseenter = uls[i].onmouseenter = function() {
                    newLis[this.index].className = "active";
                    subNav.style.opacity = "1";
                    uls[this.index].style.display = "block";
                }
                newLis[i].onmouseleave = uls[i].onmouseleave = function() {
                    newLis[this.index].className = "";
                    subNav.style.opacity = "0";
                    uls[this.index].style.display = "none";
                }
            }
            // 吸顶导航栏
            yx.addEvent(window, 'scroll', setNavPos);

            setNavPos();

            function setNavPos() {
                // if (window.pageYOffset > nav.offsetTop) {
                //     nav.id = 'navFix'
                // } else {

                //     nav.id = ''

                // }
                nav.id = window.pageYOffset > nav.offsetTop ? 'navFix' : '';
            }

        }
    }
}

// window.onmouseenter