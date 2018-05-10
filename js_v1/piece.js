/**
 * 子类 碎片
 */
var Piece = function (opts) {
    var opts= this.opts = opts || {}
    // 设置坐标和尺寸
    this.normalMsg = opts.normalMsg  || {};
    this.pressMsg = opts.pressMsg  || {}; 

    // 自由移动相关的属性
    this.toEndSpeed = opts.toEndSpeed; // 碎片自由移动到结尾的速度
    this.toStartSpeed = opts.toStartSpeed; // 碎片自由移动到开头的速度
    this.maxTime = opts.maxTime; 

    // 特有属性 当前状态  'normal', 'press'
    this.status = 'normal';
    this.normalImg = opts.normalImg;
    this.pressImg = opts.pressImg;
    
    // 当前的位置
    this.moveTo(this.normalMsg.startx, this.normalMsg.starty);
    
    // 记录像素点
    this.setImgData();
    // 记录被点中时刻的，被点的位置和碎片左边缘位置和上边缘的距离
    this.touchdisx;
    this.touchdisy;
    // 记录手指离开时刻碎片的位置
    this.releasex;
    this.releasey;
    // 记录自动移动的路径
    this.linear;
    this.moveTime = 0; // 在这条路径上移动的次数
}

/** 
 * 根据存在的路径移动
*/

Piece.prototype.translate = function(direction){
    // 如果路径没创建， 或者已经完成则返回
    if(!this.isInPath()){
        return;
    }
    // 否则，移动一步
    var tox, toy;
    this.moveTime ++;
    if(this.moveTime == this.linear.times){
        tox = this.linear.tox;
        toy = this.linear.toy;
        this.linear = null;
    }else{
        tox = this.linear.speedx * this.moveTime + this.linear.fromx;
        toy = this.linear.speedy * this.moveTime + this.linear.fromy;
    }
    this.moveTo(tox, toy);
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
    var imgData = this.imgData.data;
    var rIndex = (this.opts.designW * y + x) * 4;
    var colorR = imgData[rIndex]
    var colorG = imgData[rIndex + 1]
    var colorB = imgData[rIndex + 2]
    var colorA = imgData[rIndex + 3]
    // 如果x,y 对应的 4个点都为0 ，即为透明，则代表是不可点击， 否则则可以点击
    if(!colorR && !colorG && !colorB && !colorA){
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
Piece.prototype.isInStart = function(){
    return (this.x == this.normalMsg.startx) && (this.y == this.normalMsg.starty)
}
/**
 * 判断碎片是否处于press状态
 */
Piece.prototype.isPressed = function(){
    return this.status == 'press'
}
/**
 * 设置碎片被点中时刻，被点的位置和碎片左边缘位置的距离
 * @param {number} sx 手指的点击位置x 所转化成的canvas 的x
 * @param {number} sy 手指的点击位置y 所转化成的canvas 的y
 */
Piece.prototype.setTouchDis = function(sx, sy){
    this.touchdisx = sx - this.x;
    this.touchdisy = sy - this.y;
}
/**
 * 根据手指移动位置，直接设置碎片位置
 * @param {number} mx 手指的移动位置x 所转化成的canvas 的x
 * @param {number} my 手指的移动位置x 所转化成的canvas 的y
 */
Piece.prototype.setLoc = function(mx, my){
    this.moveTo(mx - this.touchdisx, my - this.touchdisy);
}

/**
 * 记录手指停下的位置和目标位置路径
 * @param {number} ex 手指的停下位置x 所转化成的canvas 的x
 * @param {number} ey 手指的停下位置x 所转化成的canvas 的y
 * @param {String} direction 'start' 往开始方向， 'end' 往结束方向
 */
Piece.prototype.createPath = function(ex, ey, direction){
    var fromx = ex - this.touchdisx;
    var fromy = ey - this.touchdisy;
    var tox = this.normalMsg.endx;
    var toy = this.normalMsg.endy;
    var speed = this.toEndSpeed;
    if(direction == 'start'){
        tox = this.normalMsg.startx;
        toy = this.normalMsg.starty;
        speed = this.toStartSpeed;
    }
    var disy = toy - fromy;
    var disx = tox - fromx;
    // 公式 y = k * x + b;
    // var k = disy / disx;
    // var b = fromy - k * fromx;
    var length = Math.sqrt(Math.pow(disy,2)+Math.pow(disx,2));// 路径长度
    var times = Math.ceil(length / speed); //要走的次数
    times = times > this.maxTime? this.maxTime : times;
    var speedx = disx / times; // 横坐标的速度
    var speedy = disy / times; // 纵坐标的速度
    this.linear = {fromx, fromy, tox, toy, speedx, speedy, times}
    this.moveTime = 0; // 创建完就开始自动一动
}
/**
 * 判断碎片是否还在自动移动中
 */
Piece.prototype.isInPath = function(){
    return this.linear && (this.moveTime < this.linear.times);
}
/**
 * 判断碎片是否创建了路径
 */
Piece.prototype.hasPath = function(){
    return this.linear;
}
/**
 * moveTo 函数 根据给的 x, y值进行移动
 * @param {number} x 碎片要去到的位置
 * @param {number} y 碎片要去到的位置
 */
Piece.prototype.moveTo = function(x, y){
    this.x = x;
    this.y = y;
    this.px = this.x + this.pressMsg.disx;
    this.py = this.y + this.pressMsg.disy;
}