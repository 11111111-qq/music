// 作用域隔离的写法
// var base = {
//         input: null,
//         init: function(config) {
//             this.input = document.querySelector(config.id);
//             this.bind();
//             this.render();
//             return this;
//         },
//         render: function() {
//             var num = this.input.value.length;
//             if (document.querySelectorAll(".input_num").length == 0) {
//                 this.input.insertAdjacentHTML('afterend', '<span class= "input_num" >' + num + ' </span>')
//             } else {
//                 document.querySelector('.input_num').innerHTML = num;
//             }
//         },
//         bind: function() {
//             this.input.onkeyup = () => {
//                 this.render();
//             }
//         }
//     }
// window.onload = () => {
//     base.init({ id: '#J_input' });
// }


//组件闭包的写法，类似jquery插件
// var base = (function() {
//     //私有方法与数据
//     var bind = function(that) {
//             that.input.onkeyup = function() {
//                 that.render();
//             }
//         }
//         //构造接口函数
//     var count = function() {};
//     //对外接口init
//     count.prototype.init = function(config) {
//             this.input = document.querySelector(config.id);
//             bind(this);
//             this.render();
//             return this;
//         }
//         //对外接口render
//     count.prototype.render = function() {
//             var num = this.input.value.length;
//             if (document.querySelectorAll(".input_num").length == 0) {
//                 this.input.insertAdjacentHTML('afterend', '<span class= "input_num" >' + num + ' </span>');
//             } else {
//                 document.querySelector('.input_num').innerHTML = num;
//             }
//         }
//         //返回构造函数
//     return count;
// })();
// window.onload = () => {
//     new base().init({ id: '#J_input' });
// }


//类的写法
class base {
    constructor(config) {

            this.config = config;
            this.input = document.querySelector(config.id);
            console.log(this.input)
            this.bind();
            this.render();
            return this;
        }
        //获取属性
    get _id() {
            return this.config.id;
        }
        //设置属性
    set _id(x) {
            this.config.id = x;
        }
        //内部函数
    bind() {
        try {
            this.input.onkeyup = () => {
                this.fire('text0', this.input.value.length, this.input.value.length * 2)
                this.fire('text1', this.input.value.length, this.input.value.length * 2)
                this.render();
            }
        } catch (error) {
            console.log(error)
        }

    }
    render() {
        var num = this.input.value.length || this.input.innerHTML.length;
        if (document.querySelectorAll(".input_num").length == 0) {
            this.input.insertAdjacentHTML('afterend', '<span class= "input_num" >' + num + ' </span>');
        } else {
            document.querySelector('.input_num').innerHTML = num;
        }
    }
    destroy() {
        this.off();
    }

    test() { console.log(this.input) }
}

//类的继承与监听函数

class _eventBase extends base {
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

}
let cd = new _eventBase({ id: '#J_input' });
cd.on('text1', (e, v) => {
    e > 5 ? alert('请输入低于5个字符的结果，当前输入个数： ' + e) : console.log(v)
}).on('text', console.log('45'));


// cd.destroy();