/*
* 拼图碎片
* @param src {String} 碎片图片路径
* @param origin {sx,sy,ex,ey,dw,dh} 在设计图中的，开始位置和结束位置大小
* @param auto {time,speed} 自动移动的时间,和速度
*/
function Piece(src, origin, auto){
    this.origin = origin;
    this.x = origin.sx;
    this.y = origin.sy;
    this.w = origin.dw;
    this.h = origin.dh;
    // 自动移动相关参数
    this.auto = auto; // 自动移动总共的时间
    this.isInEnd = false; // 是否已经到达结束位置

    // 画图相关参数
    this.img = null;
    this.imgData = []; // 画布上只有它的时候的 各个元素的点的集合
    this.isReady = false; // 对外的属性，告诉画布，自己是否已经准备好画画
    this.ready(src);
}
/*
* 拼图碎片做图片准备
* @param src {String} 碎片图片路径
*/
Piece.prototype.ready = function(src){
    var _self = this;
    this.img = new Image();
    this.img.src = src;

    if(img.complete){
        this.isReady = true;
    }else{
        img.onload = function(){
            _self.isReady = true;
        }
    }
}
Piece.prototype.moveByTouch = function(){

}
/*
* 拼图碎片自动移动 一步, 不确定的距离确定的时间
* @param toWhere {String} toStart 移到开始位置，toEnd 移到结束位置
* @param startTime {Number} 开始自动移动的时间
*/
Piece.prototype.autoMoveByTime = function(toWhere, startTime){
    var endx = this.origin.ex, endy = this.origin.ey;
    if(toWhere == 'toStart'){
        endx = this.origin.sx;
        endy = this.origin.sy;
    }
    var nowTime = new Date().getTime();
    var percent = (nowTime - startTime) / this.auto.time;
    if(percent < 0){
        var dx = endx - this.x;
        var dy = endy - this.y;
        this.x = percent / dx + this.x;
        this.y = percent / dy + this.y;
    }else{
        this.x = endx;
        this.y = endy;
        if(toWhere == 'toEnd'){
            this.isInEnd = true;
        }
    }
}
/*
* 拼图碎片自动移动 一步, 不确定的距离确定的速度
* @param toWhere {String} toStart 移到开始位置，toEnd 移到结束位置
*/
Piece.prototype.autoMoveBySpeed = function(toWhere){
    var endx = this.origin.ex, endy = this.origin.ey;
    if(toWhere == 'toStart'){
        endx = this.origin.sx;
        endy = this.origin.sy;
    }
    var dx = endx - this.x;
    var dy = endx - this.y;
    var speed = this.auto.speed;
    // 公式1 (endy - this.y)/ (endx - this.x) = (endy - y) / (endx - x)
    // 公式2 x*x + y*y = speed*speed
    // 解公式1： y = kx + b
    var k = dy / dx;
    var b = (this.y * endx - this.x*endy) / dx;
    // 解公式2 a1 *x*x + b1 * x + c1 = 0;
    var a1 = k * k + 1;
    var b1 = 2*k*b;
    var c1 = b*b - speed*speed;
    // 解公式 一元二次方程
    var x1 = ((-b1) + Math.sqrt(b1 * b1 - 4 * a1 * c1))/ 2 * a1;
    var x2 = ((-b1) - Math.sqrt(b1 * b1 - 4 * a1 * c1))/ 2 * a1;
    // 判断 是 x1 还是 x2
    var x = Math.abs(endx - x1) > Math.abs(endx -x2)? x2 : x1;
    var y = k * x + b;

}
/*
* 画出拼图碎片
* @param ctx {object} 画布的context
*/
Piece.prototype.draw = function(ctx){
    if(this.isReady){
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }else{
        console.log('my src is: '+ this.src, ' i am not ready');
    }
}
/*
* 设置可点击区域
* @param ctx {object} 画布的context
* @param cw,ch {number,nuber} 画布的宽高
*/
Piece.prototype.setPointArea = function(ctx, cw, ch){
    ctx.clearRect(0, 0, cw, ch);
    this.draw(ctx);
    this.imgData = ctx.getImageData(0, 0, cw, ch);
    ctx.clearRect(0, 0, cw, ch);
}
/*
* 判断是否被点击中, 判断点击位置所对应的点是否不为透明像素
* @param x,y {number,nuber} 点击位置的x,y
* @param w,h {number,nuber} 画布的宽高
* @return {boolean} 
*/
Piece.prototype.isTouch = function(x, y, cw, ch){
    var imgData = this.imgData;
    var rIndex = (cw * y + x) * 4;
    var gIndex = rIndex + 1;
    var bIndex = rIndex + 2;
    var aIndex = rIndex + 3;
    // 如果x,y 对应的 4个点都为0 ，即为透明，则代表是不可点击， 否则则可以点击
    if(!imgData[rIndex] && !imgData[gIndex] && !imgData[bIndex] && !imgData[aIndex]){
        return false;
    }
    return true;
}