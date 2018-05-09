function Round(opts){
    var opts = this.opts = opts || {}
    // 设置坐标和尺寸
    this.emptyMsg = opts.emptyMsg;
    this.fullMsg = opts.fullMsg;

     // 特有属性 当前状态  'empty', 'full'
    this.status = 'empty';
    this.emptyImage = opts.emptyImage;
    this.fullImage = opts.fullImage;
    this.loc = opts.loc; // {startx, starty, endx, endy}

    // 记录像素点
    this.setImgData();
}
Round.prototype.draw = function(){
    // 画布context
    var context = this.opts.context;
    // 坐标尺寸信息
    var emptyMsg = this.emptyMsg;
    var fullMsg = this.fullMsg; 

    if(this.status == 'empty'){
        context.drawImage(this.emptyImage, emptyMsg.x, emptyMsg.y, emptyMsg.w, emptyMsg.h);
    }else if(this.status == 'full'){
        context.drawImage(this.fullImage, fullMsg.x, fullMsg.y, fullMsg.w, fullMsg.h);
    }
}
/**
 * 设置圆形状态
 * @param {String} status // 'empty', 'full'
 */
Round.prototype.setStatus = function(status){
    this.status = status;
}

/** 
* 获取画布上是由它时的像素点的集合
*/
Round.prototype.setImgData = function(){
    context.clearRect(0, 0, this.opts.designW, this.opts.designW);
    this.draw();
    this.imgData = context.getImageData(0, 0, this.opts.designW, this.opts.designH);
}
/** 
* 判断是否被点击中, 判断点击位置所对应的点是否不为透明像素
* @param x,y {number,nuber} 点击位置的x,y
* @return {boolean} 
*/
Round.prototype.isInArea = function(x, y){
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