/**
 * 子类 碎片
 */
var Piece = function (opts) {
    var opts= this.opts = opts || {}
    // 设置坐标和尺寸
    this.normalMsg = opts.normalMsg  || {};
    this.pressMsg = opts.pressMsg  || {}; 

    this.speed = opts.speed; // 每一帧的速度
    // 特有属性 当前状态  'normal', 'press'
    this.status = 'normal';
    this.normalImg = opts.normalImg;
    this.pressImg = opts.pressImg;
    
    // 当前的位置
    this.x = this.normalMsg.startx;
    this.y = this.normalMsg.starty;
    this.px = this.x + this.pressMsg.disx;
    this.py = this.y + this.pressMsg.disy;
    
    // 记录像素点
    this.setImgData();
}

/** 
 * 方法： tanslate 根据方向
 * @param {String} direction 'start' 往开始方向， 'end' 往结束方向
*/

Piece.prototype.translate = function(direction){
    
    var x = this.x, y = this.y; 
    var startx = this.loc.startx, starty = this.loc.starty;
    var endx = this.loc.endx, endy = this.loc.endy;
    var targetx = endx, targety = endy;
    var disx = targetx - x, disy = targety - y;
    var addx = 0, addy = 0;
    var speed = this.speed;
    if(direction == 'start'){
        targetx = startx;
        targety = starty;
        disx = targetx - x;
        disy = targety - y;
    }
    if(!disx && !disy){
        return this;
    }else {
        if(!disx){
            addy = (Math.abs(disy) > speed)? ((disy > 0)? speed : -speed) : (targety - y);
        }else if(!disy){
            addx = (Math.abs(disx) > speed)? ((disx > 0)? speed : -speed) : (targetx - x);
        }else{
            var k = disy / disx;
            // 公式 addy = addx * k;
            // 公式 addy * addy + addx * addx = speed * speed;
            // 公式 a * addx * addx + b * addx + c = 0;
            var a = k * k + 1;
            var b = 0;
            var c = -(speed * speed);
            addx = (addx > 0)? ((Math.sqrt((-4) * a * c))/2 * a) : ((-Math.sqrt((-4) * a * c))/2 * a);
            addy = k * addx;
        }
    }
    this.x += addx;
    this.y += addy;
    this.px = this.x + this.pressMsg.disx;
    this.py = this.y + this.pressMsg.disy;
    return this;
}

// 方法draw
Piece.prototype.draw = function(){
    // 绘制碎片
    switch(this.status){
        case 'normal':
            context.drawImage(this.normalImg, this.x, this.y, this.normalMsg.w, this.normalMsg.h);
            break;
        case 'press':
            context.drawImage(this.pressImg, this.px, this.py, this.pressMsg.w, this.pressMsg.h);
            break;
    }
    return this;
}
/** 
* 获取画布上是由它时的像素点的集合
*/
Piece.prototype.setImgData = function(){
    context.clearRect(0, 0, this.opts.designW, this.opts.designW);
    this.draw();
    this.imgData = context.getImageData(0, 0, this.opts.designW, this.opts.designH);
}
/** 
* 判断是否被点击中, 判断点击位置所对应的点是否不为透明像素
* @param x,y {number,nuber} 点击位置的x,y
* @return {boolean} 
*/
Piece.prototype.isInArea = function(x, y){
    var imgData = this.imgData;
    var rIndex = (this.opts.designW * y + x) * 4;
    var gIndex = rIndex + 1;
    var bIndex = rIndex + 2;
    var aIndex = rIndex + 3;
    // 如果x,y 对应的 4个点都为0 ，即为透明，则代表是不可点击， 否则则可以点击
    if(!imgData[rIndex] && !imgData[gIndex] && !imgData[bIndex] && !imgData[aIndex]){
        return false;
    }
    return true;
}
/**
 * 设置碎片状态
 * @param {String} status // 'normal', 'press'
 */
Piece.prototype.setStatus = function(status){
    this.status = status;
}
/**
 * 判断碎片是否到达了他终端的位置
 */
Piece.prototype.isInTheEnd = function(){
    return (this.x == this.normalMsg.endx) && (this.y == this.normalMsg.endy);
}
/**
 * 判断碎片是否离开起点
 */
Piece.prototype.isBeenMove = function(){
    return !(this.x == this.normalMsg.startx) && (this.y == this.normalMsg.starty)
}