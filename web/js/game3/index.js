// 屏幕宽高
var clientWidth = document.documentElement.clientWidth
var clientHeight = document.documentElement.clientHeight
// 容器
var piecewp = document.getElementById('js-piecewp');

/*
* 整个游戏对象
*/
var Game = {
    /* 
    * 初始化函数，这个函数只执行一次
    * @param {object} opt
    * @retrun {[type]} [description]
    */
    init: function (opts) {
        var opts = util.assign(opts, Config)
        // 更新
        this.opts = opts
        var _self = this
        // 加载资源图片, 加载完成交互才开始
        var resources = opts.srcs;


        util.resourceOnload(resources, function (images) {
            // 创建对象实例
            _self.st = new Date().getTime()
            _self.createObj();
            console.log('创建对象完毕，距离开始', (new Date()).getTime() - _self.st)
            _self.addHandler();
        })
    },
    /**
     * 创建对象
     */
    createObj: function () {
        // 分数对象
        this.grade = Grade.init('js-gradewp')
        // 创建 触碰对象
        this.touch = new Touch(piecewp)
        // 创建碎片对象
        this.pieces = [];
        for (var i = 0, len = this.opts.srcs.length; i < len; i++) {
            var img = document.createElement('img');
            img.className = 'piece';
            img.src = this.opts.srcs[i];
            var w = this.opts.msg.w / this.opts.designW * clientWidth;
            var obj = {
                el: img,
                w: w,
                x: i * w,
                index: i,
                endIndex: this.opts.endIndex[i]
            }
            var o = util.assign(this.opts, obj);
            this.pieces[i] = new Piece(o);
            piecewp.appendChild(img);
        }

    },
    /**
     * 添加监听
     */
    addHandler: function () {

        var r = document.getElementById('js-return');
        r.addEventListener('touchstart', function (event) {
            location.href = 'index.html'
        }, { passive: true });
    },
    /**
     * 回到初始状态
     */
    reset: function () {
        for (var i = 0, len = this.pieces.length; i < len; i++) {
            this.pieces[i].reset();
        }
    },
    play: function(){},
    /* 
    * 结束游戏，停止循环
    */
    end: function () {
        console.log('end')
        this.grade.show2();
        // this.grade.sendMsg();
    },
    /**
     * 判断是否结束
     */
    isEnd: function () {
        for (var i = 0, len = this.pieces.length; i < len; i++) {
            if (!this.pieces[i].isEnd()) {
                return false;
            }
        }
        return true;
    },
    /**
     * game 被触发什么事件
     * @param {String} type 事件类型
     * @param {Object} extra 传参对象
     */
    trigger: function (type, extra) {
        if (type == 'touchstart') {
            for (var i = 0, len = this.pieces.length; i < len; i++) {
                if (extra.tg == this.pieces[i].el && this.pieces[i].canTouch() && !this.isEnd()) {
                    this.pieces[i].setTouchLoc(this.touch.startX);
                    this.touchPiece = this.pieces[i];
                    this.update();
                    break;
                }
            }
        }
        if (type == 'touchmove') {
            if (this.touchPiece) {
                this.touchPiece.setMoveLoc(this.touch.moveX);
            }
        }
        if (type == 'touchend') {
            var tp = this.touchPiece;
            if (tp) {
                for (var i = 0, len = this.pieces.length; i < len; i++) {
                    var piece = this.pieces[i]
                    if (piece.isInArea(this.touch.endX)) {
                        if (piece == tp) {
                            piece.release(piece.index);
                        } else {
                            var tindex = tp.index, index = piece.index;
                            piece.release(tindex);
                            tp.release(index);
                            break;
                        }
                        console.log(i)
                        // break;
                    }
                }
                if(this.isEnd()){
                    var self = this;
                    setTimeout(function(){
                        self.end()
                    }, this.opts.releaseTime + 100)
                }
                this.touchPiece = null;
            }
        }
    },
    /*
    * 游戏每一帧的更新函数
    */
    update: function () {
        if (this.touch.isTouchStart && this.touchPiece) {
            this.touchPiece.draw();
            cancelAnimFrame(this.timer);
            this.timer = requestAnimFrame(this.update.bind(this));
        }
    }
}

// 改变根的字体大小
util.setFontSize(Config);
// 初始化
Game.init()