function Piece(opts) {
    // 无阴影信息
    var msg = opts.msg;
    this.startx = msg.startx;
    this.starty = msg.starty;
    this.endx = msg.endx;
    this.endy = msg.endy;

    // 有阴影信息
    this.pmsg = opts.pmsg;
    // 对应目标信息
    this.targetmsg = opts.targetmsg;
    // dom
    this.el = opts.el;
    this.el.style.width = msg.w + 'px';
    this.elcls = this.el.className;
    this.pel = opts.pel;
    this.pel.style.width = this.pmsg.w + 'px';
    this.pelcls = this.pel.className;
    // 时间
    this.trancls = opts.trancls;
    this.discls = opts.discls
    this.disTime = opts.disTime
    this.releaseTime = opts.releaseTime
    this.disTimer = null;
    this.releaseTimer = null;
    this.zIndex = opts.zIndex
    // 信息
    this.reset();
}
/** 
* 判断（x,y) 是否是这个元素上面的点
* @param x,y {number,nuber} canvas 中对应 的 x, y 值
* @return {boolean} 
*/
Piece.prototype.isInTarget = function (x, y) {
    var tgmsg = this.targetmsg;
    if (x >= tgmsg.x && x <= tgmsg.x + tgmsg.w && y >= tgmsg.y && y <= tgmsg.y + tgmsg.h) {
        return true;
    }
    return false;
}
/**
 * 初始化 或者重置化碎片参数，可以改变的参数
 */
Piece.prototype.reset = function () {
    // 被移动时移动Piece 的点 到Piece边界的距离
    this.disx = 0;
    this.disy = 0;
    // 设置x,y为开始值
    this.setXY(this.startx, this.starty);
    // 设置状态
    this.setStatus('start');
    this.el.className = this.elcls;
    this.draw();
}
/**
 * 设置碎片 和有阴影碎片的x,y 值
 */
Piece.prototype.setXY = function (x, y) {
    this.x = x;
    this.y = y;
    this.px = this.x + this.pmsg.disx;
    this.py = this.y + this.pmsg.disy;
}

/**
 * 画出钱
 */
Piece.prototype.draw = function () {
    if (this.isInStart()) {
        this.el.style.display = 'none';
        this.pel.style.display = 'block';
        this.pel.style.left = this.px + 'px';
        this.pel.style.top = this.py + 'px';
    } else {
        this.el.style.display = 'block';
        this.pel.style.display = 'none';
        this.el.style.left = this.x + 'px';
        this.el.style.top = this.y + 'px';
    }
}
/**
 * @param {string} status 钱的状态 'start', 'touch', 'release', 'end', 'disappear'
 */
Piece.prototype.setStatus = function (status) {
    this.status = status;
}
/**
 * 设置Mondy 被触碰的点 到 边距的距离, 设置距离说明开始触碰
 * @param {number} x canvas上面被触碰的的x
 * @param {number} y canvas上面被触碰的的y
 */
Piece.prototype.setTouchLoc = function (x, y) {
    this.setStatus('touch');
    this.el.style.zIndex = this.zIndex * 2;
    this.pel.style.zIndex = this.zIndex * 2;
    this.disx = Math.floor(x - this.x);
    this.disy = Math.floor(y - this.y);
}
/**
 * 让Piece运动到（x,y) 这个位置
 * @param {number} x canvas上面的x
 * @param {number} y canvas上面的y
 */
Piece.prototype.setMoveLoc = function (x, y) {
    this.setXY(Math.floor(x - this.disx), Math.floor(y - this.disy))
}
/**
 * 让Piece释放之后的操作
 * @param {number} ex 
 * @param {number} ey 
 */
Piece.prototype.release = function (ex, ey) {
    if (this.isInTarget(ex, ey)) {
        this.setStatus('release')
        this.el.className = this.elcls + ' ' + this.trancls;
        this.setXY(this.endx, this.endy);
        this.draw();
        var self = this;
        self.setStatus('end');
        clearTimeout(this.releaseTimer)
        this.releaseTimer = setTimeout(function () {
            self.el.style.zIndex = self.zIndex;
            self.pel.style.zIndex = self.zIndex;
            self.el.className = self.elcls;
            self.setXY(self.endx, self.endy);
            self.draw()
        }, this.releaseTime)
    } else {
        this.setStatus('release')
        this.el.className = this.elcls + ' ' + this.trancls;
        this.setXY(this.startx, this.starty);
        this.draw();
        var self = this;
        clearTimeout(this.releaseTimer)
        this.releaseTimer = setTimeout(function () {
            self.setStatus('start');
            self.el.style.zIndex = self.zIndex;
            self.pel.style.zIndex = self.zIndex;
            self.el.className = self.elcls;
            self.setXY(self.startx, self.starty);
            self.draw()
        }, this.releaseTime)
    }
}



/**
 * 判断是否被触碰状态
 */
Piece.prototype.isInTouch = function () {
    return this.status == 'touch'
}
/**
 * 判断是否回到开始状态
 */
Piece.prototype.isInStart = function () {
    return this.status == 'start'
}
/**
 * 判断是否释放状态
 */
Piece.prototype.isInRelease = function () {
    return this.status == 'release'
}
/**
 * 判断是到达结尾准备消失状态
 */
Piece.prototype.isInEnd = function () {
    return this.status == 'end'
}