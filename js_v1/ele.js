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
 * 通用方法 draw()
 */
Ele.prototype.draw = function () {}