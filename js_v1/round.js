function Round(opts){
    var opts = opts || {};
    Ele.call(this, opts);
    // 设置坐标和尺寸
    this.emptyMsg = opts.emptyMsg;
    this.fullMsg = opts.fullMsg;

     // 特有属性 当前状态  'empty', 'full'
    this.status = 'empty';
    this.emptyImage = opts.emptyImage;
    this.fullImage = opts.fullImage;
    this.loc = opts.loc; // {startx, starty, endx, endy}

    // 记录像素点
    this.colorR = this.emptyMsg.r;
    this.colorG = this.emptyMsg.g;
    this.colorB = this.emptyMsg.b;
    this.colorA = this.emptyMsg.a;
    this.imgData = this.opts.imgData;
}
util.inHeritObject(Ele, Round);

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

