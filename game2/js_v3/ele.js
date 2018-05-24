var Ele = function (opts) {
    this.opts = opts || {};
    var msg = opts.msg;
    // 创建 对象 时 this.x == this.startx
    this.x = this.startx = msg.x || msg.startx;
    this.y = this.starty = msg.y || msg.starty;
    this.endx = msg.endx || msg.x;
    this.endy = msg.endy || msg.y;
    this.w = msg.w;
    this.h = msg.h;
    // 对应类型
    this.type = msg.type;
    // 画布context
    this.ctx = opts.context;
    // 离屏canvas 缓存图像
    this.img = opts.img;
    this.can = document.createElement('canvas');
    this.can.width = this.w;
    this.can.height = this.h;
    var ctx = this.can.getContext('2d')
    ctx.drawImage(this.img, 0, 0,this.w, this.h);
    
}

/** 
* 判断（x,y) 是否是这个元素上面的点
* @param x,y {number,nuber} canvas 中对应 的 x, y 值
* @return {boolean} 
*/
Ele.prototype.isInArea = function (x, y) {
    if(x > this.startx && x < this.startx + this.w && y > this.starty && y < this.starty + this.h && this.isInStart()){
        return true;
    }
    return false;
}

/**
 * 判断该元素当前的位置是否是它开始的位置，也就是说是否在可点击位置
 * 默认返回true（对应禁止的元素），运动的元素重写此方法
 */
Ele.prototype.isInStart = function () {
    return true;
}

/**
 * 通用方法 draw()
 * 如果元素与方法不同，则重新重写
 */
Ele.prototype.draw = function () {
    this.ctx.drawImage(this.can, this.x, this.y)
}