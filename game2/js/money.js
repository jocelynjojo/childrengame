function Money(opts) {
    Ele.call(this, opts);
    // 自由运动最多运动的次数
    this.maxTime = this.opts.maxTime;
    // 在没到达最多运动次数的情况下他的速度
    this.speed = this.opts.speed;
    // 类型：coin\paper
    this.type = this.opts.msg.type;
    // 自动运动的路径, 和这条路径上面运动的次数
    this.pathMsg = null;
    this.moveTime = 0;
    // 被移动时移动Money 的点 到Money边界的距离
    this.disx = 0;
    this.disy = 0;
    // 消失状态下程序了几次
    this.disappearTime = 0;
    // 设置状态
    this.setStatus('start');
}
/**
 * 画出带阴影的钱
 */
Money.prototype.drawShadow = function () {
    var ctx = this.ctx;
    ctx.save();
    ctx.shadowOffsetX = 15; // 阴影Y轴偏移
    ctx.shadowOffsetY = 15; // 阴影X轴偏移
    ctx.shadowBlur = 14; // 模糊尺寸
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 颜色
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    ctx.restore();
}
/**
 * 画透明的图片
 */
Money.prototype.drawOpacity = function () {
    var ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    ctx.restore();
}
/**
 * 画出钱
 */
Money.prototype.draw = function () {
    if (this.status == 'touch') {
        this.drawShadow();
    } else if (this.status == 'end') {
        this.drawOpacity();
    } else {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}
/**
 * @param {string} status 钱的状态 'start', 'touch', 'release', 'end', 'disappear'
 */
Money.prototype.setStatus = function (status) {
    this.status = status;
}
/**
 * 设置Mondy 被触碰的点 到 边距的距离, 设置距离说明开始触碰
 * @param {number} x canvas上面被触碰的的x
 * @param {number} y canvas上面被触碰的的y
 */
Money.prototype.setTouchLoc = function (x, y) {
    this.setStatus('touch');
    this.disx = Math.floor(x - this.x);
    this.disy = Math.floor(y - this.y);
}
/**
 * 让Money运动到（x,y) 这个位置
 * @param {number} x canvas上面的x
 * @param {number} y canvas上面的y
 */
Money.prototype.setLoc = function (x, y) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
}

/**
 * 创建 Money 自动 回到开始位置的路径信息，包括两头的位置，运动时间和速度, 创建路径说明开始释放
 */
Money.prototype.setBackPath = function () {
    var minusx = this.startx - this.x;
    var minusy = this.starty - this.y;
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
    this.pathMsg = { endx: this.startx, endy: this.starty, speedx: speedx, speedy: speedy, times: times };
}

/**
 * 在创建路径之后走的每一步
 */
Money.prototype.step = function () {
    if (this.pathMsg) {
        this.moveTime++;
        if (this.moveTime >= this.pathMsg.times) {
            // 运动次数足够，说明这次运动完成后可以结束这条路径
            this.x = this.pathMsg.endx;
            this.y = this.pathMsg.endy;
            this.pathMsg = null;
            this.moveTime = 0;
        } else {
            this.x += this.pathMsg.speedx;
            this.y += this.pathMsg.speedy;
        }
    }
}
/**
 * 让他自由移动回到原点
 */
Money.prototype.autoMoveBack = function (type) {
    if (!this.isInStart()) {
        if (this.pathMsg) {
            this.step();
        } else {
            this.setBackPath();
        }
    }
}
/**
 * 让他自己消失
 */
Money.prototype.disappear = function (type) {
    var times = this.opts.disappearTime;
    this.disappearTime++;
    this.setStatus('end')
    if (this.disappearTime >= times) {
        // 让他完全消失掉
        this.setStatus('disappear')
    }
}