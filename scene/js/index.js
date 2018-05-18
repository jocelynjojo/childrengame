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
            self.touchStart(event);
        }, { passive: false })
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
                if (success) {
                    for (var j = 0, l = success.length; j < l; j++) {
                        var name = success[i].name;
                        this.images[name] && context.drawImage(this.images[name], success[j].x, success[j].y, success[j].w, success[j].h);
                    }
                }
                if (i == index) {
                    var now = this.opts.now;
                    for (var j = 0, l = now.length; j < l; j++) {
                        var name = now.name;
                        this.images[name] && context.drawImage(this.images[name], base.x + now[j].disx, base.y + now[j].desy, now[j].w, now[j].h);
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
    }
}
Game.init(Config);