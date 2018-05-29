/**
 * 子类 碎片
 */
var Piece = function (opts) {
    this.opts = opts;
    this.el = opts.el;
    this.w = opts.w;
    this.startx = this.x = opts.x; // 真正的距离
    this.index = opts.index;
    this.endIndex = opts.endIndex;
    this.zIndex = opts.zIndex;
    this.releaseTime = opts.releaseTime
    this.timer = null
    this.aniClass = opts.aniClass
    this.cls = this.el.className;
    this.shadowCls = opts.shadowCls;
}
/**
 * 初始化 或者重置化碎片参数，可以改变的参数
 */
Piece.prototype.reset = function(){
    // 自动运动的路径, 和这条路径上面运动的次数
    this.x = this.startx;
    this.el.style.zIndex = this.zIndex;
    this.draw();
}

/**
 * 画出碎片
 */
Piece.prototype.draw = function () {
    this.el.style.left = this.x + 'px';
}

/**
 * 设置Piece 被触碰的点 到 边距的距离, 设置距离说明开始触碰
 * @param {number} x canvas上面被触碰的的x
 * @param {number} y canvas上面被触碰的的y
 */
Piece.prototype.setTouchLoc = function (x, y) {
    this.disx = Math.floor(x - this.x);
    this.el.style.zIndex = this.zIndex * 2;
    this.el.className = this.cls + ' ' + this.shadowCls;
}
/**
 * 让Piece运动到（x,y) 这个位置
 * @param {number} x canvas上面的x
 */
Piece.prototype.setMoveLoc = function (x) {
    this.x = Math.floor(x - this.disx)
}
/**
 * 让Piece滑动到 index = i 的位置
 * @param {number} i
 */
Piece.prototype.release = function(i){
    this.isInRelease = true;
    this.index = i;
    this.x = i * this.w;
    this.el.className = this.cls + ' ' + this.aniClass;
    this.draw();
    clearTimeout(this.timer)
    var self = this;
    this.timer = setTimeout(function(){
        self.el.className = self.cls;
        self.el.style.zIndex = self.zIndex;
        self.isInRelease = false;
    }, this.releaseTime)
}
/**
 * 判断手指是否在在这个区域
 * @param {number} x 
 */
Piece.prototype.isInArea = function (x) {
    if(x >= this.x && x <= this.x + this.w){
        return true;
    }
    return false;
}
/**
 * 判断是否到达目的地
 */
Piece.prototype.isEnd = function (x) {
    if(this.index == this.endIndex){
        return true;
    }
    return false;
}
/**
 * 判断碎片是否可以被触摸移动
 */
Piece.prototype.canTouch = function(){
    return !this.isInRelease;
}
