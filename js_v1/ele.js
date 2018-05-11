var Ele = function (opts) {
    this.opts = opts || {};
}
/** 
* 获取画布上只有它时的像素点的集合
*/
Ele.prototype.setImgData = function(){
    context.clearRect(0, 0, this.opts.designW, this.opts.designW);
    this.draw();
    this.imgData = context.getImageData(0, 0, this.opts.designW, this.opts.designH);
}
/** 
* 判断传入的点是都是这个元素上面中的可见点
* @param x,y {number,nuber} 点击位置的x,y
* @return {boolean} 
*/
Ele.prototype.isInArea = function(x, y){
    var imgData = this.imgData.data;
    x = Math.floor(x);
    y = Math.floor(y)
    var rIndex = (this.opts.designW * y + x) * 4;
    var colorR = imgData[rIndex]
    var colorG = imgData[rIndex + 1]
    var colorB = imgData[rIndex + 2]
    var colorA = imgData[rIndex + 3]
    // 如果x,y 对应的 4个点都为0 ，即为透明，则代表是不可点击， 否则则可以点击
    if((colorR || colorG || colorB || colorA) && this.isInStart()){
        return true;
    }
    return false;
}

/**
 * 判断该元素当前的位置是否是它开始的位置，或者说是否得到元素点集合的位置
 * 碎片会移动，重写这方法，其他元素不会移动，不需重写这个方法
 */
Ele.prototype.isInStart = function(){
    return true;
}
/**
 * 根据传入的msg 设置自己的 x, y, w, h;
 * @param {Image} img
 * @param {Object} msg img 对应的的信息 {w,h,x,y,disx,disy} disx 和 x 不一定存在
 * @param {Object} extra 基本xy对应的信息
 */
Ele.prototype.setMsg = function(img, msg, extra){
    this.img = img;
    this.x = msg.x;
    this.y = msg.y;
    this.w = msg.w;
    this.h = msg.h;
    if(extra && !this.x && !this.y){
        this.x = msg.disx + extra.x;
        this.y = msg.disy + extra.y;
    }
}
/**
 * 通用方法 draw()
 * 如果进行了上面setMsg 的方法可以直接用，其他的需要重写
 */
Ele.prototype.draw = function () {
    context.drawImage(this.img, this.x, this.y, this.w, this.h)
}