var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
var clientWidth = canvas.clientWidth;
var clientHeight = canvas.clientHeight;

var Game = {
    init: function (opts) {
        this.opts = opts;
        var self = this;
        util.resourceOnload(this.opts.srcs, function (images) {
            self.images = images;
            self.addEvent();
            self.draw();
        })
    },
    addEvent: function (type) {
        var self = this;
        canvas.addEventListener('touchstart', function (event) {
            event.stopPropagation();
            event.preventDefault()
            self.playGame(event);
        }, { passive: false });
        var doc = document;
        var s = doc.getElementById('js-switch');
        s.addEventListener('touchstart', function (event) {
            console.log('switch')
        }, { passive: true });
        var btnwp = doc.getElementById('js-btnwp');
        btnwp.addEventListener('touchstart', function (event) {
            var tg = event.target;
            if (tg.id == 'js-btnstar') {
                location.href = 'starlist.html'
            }
            if (tg.id == 'js-btnmedal') {
                location.href = 'medallist.html'
            }
            if (tg.id == 'js-btncertificate') {
                console.log('btncertificate')
            }
            if (tg.id == 'js-btngrow') {
                console.log('js-btngrow')
            }
            if (tg.id == 'js-btnflower') {
                console.log('js-btnflower')
            }
            if (tg.id == 'js-btntime') {
                console.log('js-btntime')
            }
        }, { passive: true });
        var btnwp1 = doc.getElementById('js-btnwp1');
        btnwp1.addEventListener('touchstart', function (event) {
            var tg = event.target;
            if (tg.id == 'js-weibo') {
                console.log('js-weibo')
            }
            if (tg.id == 'js-wx') {
                console.log('js-wx')
            }
        }, { passive: true });
    },
    draw: function () {
        context.clearRect(0, 0, this.opts.designW, this.opts.designH)
        var index = this.opts.level;
        var allNum = this.opts.allNum;
        for (var i = 0; i < allNum; i++) {
            var str = 'level' + i;
            var level = this.opts.tree[str];
            var base = level.base || { x: 0, y: 0 };
            if (i <= index) {
                // success
                var success = level.success;
                if(success && !(i == 0 && i < index)){
                    for (var j = 0, l = success.length; j < l; j++) {
                        var name = success[j].name;
                        this.images[name] && context.drawImage(this.images[name], success[j].x, success[j].y, success[j].w, success[j].h);
                    }
                }
                if (i == index) {
                    var now = this.opts.now;
                    for (var j = 0, l = now.length; j < l; j++) {
                        var name = now[j].name;
                        this.images[name] && context.drawImage(this.images[name], base.x + now[j].disx, base.y + now[j].disy, now[j].w, now[j].h);
                    }
                }
            } else {
                // 未通关
                if (base && base.name) {
                    context.drawImage(this.images[base.name], base.x, base.y, base.w, base.h);
                }
                var extra = level.extra;
                if (extra) {
                    for (var j = 0, l = extra.length; j < l; j++) {
                        var name = extra[j].name;
                        this.images[name] && context.drawImage(this.images[name], extra[j].x, extra[j].y, extra[j].w, extra[j].h);
                    }
                }

            }

        }
    },
    playGame: function (event) {
        var touches = event.touches[0];
        var sx = touches.clientX;
        var sy = touches.clientY;
        sx = sx / clientWidth * this.opts.designW;
        sy = sy / clientHeight * this.opts.designH;
        for (var i = 1, allNum = this.opts.allNum; i < allNum; i++) {
            var str = 'level' + i;
            var level = this.opts.tree[str];
            var base = level.base || { x: 0, y: 0 , w:0, h:0};
            if(sx >= base.x && sx <= base.x + base.w && sy >= base.y && sy <= base.y + base.h){
                console.log('game' + i)
                break;
            }
        }
    }
}
Config.init(2, 'images/user.png', 0)
util.setFontSize(Config)
Game.init(Config);