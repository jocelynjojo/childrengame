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
    // 对应的颜色
    this.colorR = msg.r;
    this.colorG = msg.g;
    this.colorB = msg.b;
    this.colorA = msg.a;
    this.img = opts.img;
    this.ctx = opts.context;
    // canvas上面所有像素点的集合
    this.imgData = opts.imgData;
}
/** 
* 判断（x,y) 是否是这个元素上面的点
* @param x,y {number,nuber} canvas 中对应 的 x, y 值
* @return {boolean} 
*/
Ele.prototype.isInArea = function (x, y) {
    var imgData = this.imgData.data;
    x = Math.floor(x);
    y = Math.floor(y)
    var rIndex = (this.opts.designW * y + x) * 4;
    var colorR = imgData[rIndex]
    var colorG = imgData[rIndex + 1]
    var colorB = imgData[rIndex + 2]
    var colorA = imgData[rIndex + 3]
    // 
    if ((Math.abs(colorR - this.colorR) < 5) && (Math.abs(colorG - this.colorG) < 5) && (Math.abs(colorB - this.colorB) < 5) && (Math.abs(colorA - this.colorA) < 5) && this.isInStart()) {
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
    this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
}