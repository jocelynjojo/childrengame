/**
 * 子类 碎片
 */
var Piece = function (opts) {
    var opts = opts || {}
    Ele.call(this, opts);
    // 自由运动最多运动的次数
    this.maxTime = this.opts.maxTime;
    // 在没到达最多运动次数的情况下他的速度
    this.speed = this.opts.speed;

    // 独有的点击状态
    this.pmsg = this.opts.pmsg; //{w:337, h:446, disx:-56, disy:-48}
    this.pimg = this.opts.pimg;
    this.pcan = document.createElement('canvas');
    this.pcan.width = this.pmsg.w;
    this.pcan.height = this.pmsg.h;
    var pctx = this.pcan.getContext('2d')
    pctx.drawImage(this.pimg, 0, 0, this.pmsg.w, this.pmsg.h);

    this.reset();
}
util.inHeritObject(Ele, Piece);
/**
 * 初始化 或者重置化碎片参数，可以改变的参数
 */
Piece.prototype.reset = function(){
    // 自动运动的路径, 和这条路径上面运动的次数
    this.pathMsg = null;
    this.moveTime = 0;
    // 被移动时移动Piece 的点 到Piece边界的距离
    this.disx = 0;
    this.disy = 0;
    // 设置x,y为开始值
    this.setXY(this.startx, this.starty);
    // 设置状态
    this.setStatus('start');
}
/**
 * 设置碎片 和有阴影碎片的x,y 值
 */
Piece.prototype.setXY = function(x,y){
    this.x = x;
    this.y = y;
    this.px = this.x + this.pmsg.disx;
    this.py = this.y + this.pmsg.disy;
}


/**
 * 画出碎片
 */
Piece.prototype.draw = function () {
    if (this.isInStart()) {
        // this.drawShadow(0.8, 80);
        this.ctx.drawImage(this.pcan, this.px, this.py);
    } else {
        this.ctx.drawImage(this.can, this.x, this.y);
    }
}
/**
 * @param {string} status 状态 'start', 'touch', 'release', 'end'
 */
Piece.prototype.setStatus = function (status) {
    this.status = status;
}

/**
 * 设置Piece 被触碰的点 到 边距的距离, 设置距离说明开始触碰
 * @param {number} x canvas上面被触碰的的x
 * @param {number} y canvas上面被触碰的的y
 */
Piece.prototype.setTouchLoc = function (x, y) {
    this.setStatus('touch');
    this.disx = Math.floor(x - this.x);
    this.disy = Math.floor(y - this.y);
}
/**
 * 让Piece运动到（x,y) 这个位置
 * @param {number} x canvas上面的x
 * @param {number} y canvas上面的y
 */
Piece.prototype.setMoveLoc = function (x, y) {
    this.setXY(Math.floor(x - this.disx), Math.floor(y - this.disy));
}
/**
 * 创建 Piece 自动 回到开始位置的路径信息，包括两头的位置，运动时间和速度, 创建路径说明开始释放
 * @param {String} direction 'start' 往开始方向， 'end' 往结束方向
 */
Piece.prototype.createPath = function (direction) {
    this.setStatus('release');
    var targetx = this.endx;
    var targety = this.endy;
    if (direction == 'start') {
        targetx = this.startx;
        targety = this.starty;
    }
    var minusx = targetx - this.x;
    var minusy = targety - this.y;
    var pathLen = Math.sqrt(Math.pow(minusx, 2) + Math.pow(minusy, 2));
    var speedx, speedy;
    var times = Math.ceil(pathLen / this.speed);
    if (times > this.maxTime) {
        // 如果路径太长导致运动次数太多，则提速, 减少次数到this.maxTime
        times = this.maxTime;
    }
    var dirx = minusx / Math.abs(minusx);
    var diry = minusy / Math.abs(minusy);
    speedx = Math.ceil(Math.abs(minusx) / times) * dirx;
    speedy = Math.ceil(Math.abs(minusy) / times) * diry;
    this.pathMsg = { endx: targetx, endy: targety, speedx: speedx, speedy: speedy, times: times, status: direction };
}
/**
 * 在创建路径之后走的每一步
 */
Piece.prototype.step = function () {
    if (this.pathMsg) {
        this.moveTime++;
        if (this.moveTime >= this.pathMsg.times) {
            // 运动次数足够，说明这次运动完成后可以结束这条路径
            this.setXY(this.pathMsg.endx, this.pathMsg.endy)
            this.setStatus(this.pathMsg.status);
            this.clearPath();
        } else {
            this.setXY(this.x + this.pathMsg.speedx, this.y + this.pathMsg.speedy)
        }
    }
}
/**
 * 清除创建的路径
 */
Piece.prototype.clearPath = function () {
    this.pathMsg = null;
    this.moveTime = 0;
}

/**
 * 判断是否被触碰状态
 */
Piece.prototype.isInTouch = function () {
    return this.status == 'touch'
}
/**
 * 判断是否回到开始状态
 */
Piece.prototype.isInStart = function () {
    return this.status == 'start'
}
/**
 * 判断是否释放状态
 */
Piece.prototype.isInRelease = function () {
    return this.status == 'release'
}
/**
 * 判断是到达结尾
 */
Piece.prototype.isInEnd = function () {
    return this.status == 'end'
}