// 画布
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
// 屏幕宽高
var clientWidth = canvas.clientWidth
var clientHeight = canvas.clientHeight

/*
* 整个游戏对象
*/
var Game = {
  /* 
  * 初始化函数，这个函数只执行一次
  * @param {object} opt
  * @retrun {[type]} [description]
  */
  init: function (opts) {
    var opts = util.assign(opts, Config)
    opts.context = context
    // 更新
    this.opts = opts
    this.setStatus('start')

    var _self = this
    // 加载资源图片, 加载完成交互才开始
    var resources = opts.moneySrc.concat(opts.containerSrc)
    resources.push(opts.imgdataSrc)
    // 获取资源数量
    var moneyNum = opts.moneySrc.length;
    var conNum = opts.containerSrc.length;
    // 加载
    util.resourceOnload(resources, function (images) {
      opts.moneyImgs = images.slice(0, moneyNum)
      opts.containerImgs = images.slice(moneyNum, conNum + moneyNum)
      opts.dataImg = images[conNum + moneyNum]
      // 创建触摸实例
      _self.touch = new Touch(opts.canvas)
      _self.setImgData();
      _self.play()
    })
  },
  setImgData: function () {
    var imgdataMsg = this.opts.imgdataMsg;
    context.clearRect(0, 0, this.opts.designW, this.opts.designH);
    context.drawImage(this.opts.dataImg, imgdataMsg.x, imgdataMsg.y, imgdataMsg.w, imgdataMsg.h);
    this.opts.imgData = context.getImageData(0, 0, this.opts.designW, this.opts.designH);
  },
  /**
   * 回到初始状态
   */
  reset: function () {
    this.setStatus('start')
  },
  /** 
  * 更新游戏状态
  * @param {Staring} status //start:开始游戏， end：结束游戏
  */
  setStatus: function (status) {
    this.status = status
  },
  play: function () {
    var _self = this
    // 看创建对象的时间
    this.st = (new Date()).getTime();
    var opts = this.opts
    // 创建 容器实例
    this.containers = [];
    for (var i = 0, len = opts.containerMsg.length; i < len; i++) {
      var o = {
        img: opts.containerImgs[i],
        msg: opts.containerMsg[i],
      }
      var opt = util.assign(opts, o);
      this.containers[i] = new Container(opt);
    }

    // 创建Money实例
    this.moneys = []
    for (var i = 0, len = opts.moneyMsgs.length; i < len; i++) {
      var o = {
        img: opts.moneyImgs[i],
        msg: opts.moneyMsgs[i],
      }
      var opt = util.assign(opts, o);
      this.moneys[i] = new Money(opt);
    }

    // 开始进行绘画更新
    console.log('准备开始进行绘画更新, 创建对象用时：', (new Date()).getTime() - this.st)
    this.update()
    console.log('初始绘画完毕，用时：', (new Date()).getTime() - this.st)
  },
  /* 
  * 结束游戏，停止循环
  */
  end: function () {
    console.log('end')
  },
  /**
   * game 被触发什么事件
   * @param {String} type 事件类型
   * @param {Object} extra 传参对象
   */
  trigger: function (type, extra) {
  },
  /*
  * 游戏每一帧的更新函数
  */
  update: function () {
    var _self = this
    // 清除操作
    context.clearRect(0, 0, this.opts.designW, this.opts.designH)
    // 更新对象数据 money
    this.updateMoneys()

    // 绘制画布
    this.draw()
    // 判断游戏是否结束
    if (this.isEnd()) {
      this.end()
    } else {
      requestAnimFrame(function () {
        _self.update()
      })
    }
  },
  /*
  * 更新碎片对象
  */
  updateMoneys: function () {

    var sx = this.touch.startX
    var sy = this.touch.startY
    sx = sx / clientWidth * this.opts.designW
    sy = sy / clientHeight * this.opts.designH
    var mx = this.touch.moveX
    var my = this.touch.moveY
    mx = mx / clientWidth * this.opts.designW
    my = my / clientHeight * this.opts.designH
    var ex = this.touch.endX
    var ey = this.touch.endY
    ex = ex / clientWidth * this.opts.designW
    ey = ey / clientHeight * this.opts.designH
    // 手指不触碰的时候，并且手指未触碰过 或者 触碰了 (0,0)的地方则 返回
    if (!this.touch.isTouchStart && !sx && !sy) {
      return;
    }
    // this.moneys 是否还有对象, 没有对象则游戏结束
    var total = this.moneys.length;
    var money
    // 循环moneys 对象，看是否有已经消失掉的
    for (var i = 0; i < total; i++) {
      money = this.moneys[i];
      if (money.isDisappear()) {
        this.moneys.splice(i, 1);
        total--;
        i--;
      }
    }
    // this.moneys 是否还有对象, 没有对象则游戏结束
    if (!total) {
      this.setStatus('end');
      return;
    }
    // 在 money 前一次的各种状态下对它进行这次操作 // 开始状态，触碰状态，释放状态，目的地状态
    for (var i = 0; i < total; i++) {
      money = this.moneys[i]
      if (money.isInStart()) {
        // 前次开始状态下，这次如果被点中触碰击态
        if(this.touch.isTouchStart && money.isInArea(sx, sy)){
           money.setTouchLoc(sx, sy);
        }
      }else if (money.isInTouch()){
        // 前次触碰状态下，这次如果释放，变释放态或到目的地态，若一直触碰并移动，则跟着触碰设置位置
        if(this.touch.isTouchStart && this.touch.isTouchMove){
          money.setMoveLoc(mx, my);
        }else if(!this.touch.isTouchStart){
          // 触碰刚释放，需要看释放在什么位置；
          var j = 0, l = this.containers.length, con = null;
          for (; j < l; j++) {
            con = this.containers[j];
            if (con.type == money.type && con.isInArea(ex, ey)) {
              money.doInContainer();
              break;
            }
          }
          // 上面如果通过break 跳出则是释放在对应的container, 否则则不对应，创建回去的路径
          if (j == l) {
            money.setBackPath();
          }
        }
      }else if(money.isInRelease()){
        // 前次释放状态下，如果回到初始位置变初始态，否则继续移动 
        money.step();
      }else if(money.isInEnd()){
        // 前次结束状态, 让他慢慢消失掉
        money.toDisappear();
      }else{
        continue;
      }
    }
  },
  draw: function () {
    // 先画container
    for(var i = 0, len = this.containers.length; i < len; i++){
      this.containers[i].draw();
    }
    // 再画money
    var money, releaseArr = [], touchIndex = -1;
    for (var i = 0, len = this.moneys.length; i < len; i++) {
      money = this.moneys[i];
      if (money.isInTouch()) {
        touchIndex = i;
      } else if (money.isInRelease()) {
        releaseArr.push(i);
      } else {
        money.draw();
      }

    }
    for(var i = 0, len = releaseArr.length; i < len; i++){
      var index = releaseArr[i];
      this.moneys[index].draw();
    }
    if (touchIndex != -1) {
      this.moneys[touchIndex].draw();
    }

  },
  lastDraw: function () {
    this.draw();
    this.grade.draw(this.opts.starNum);
  },
  /**
   * 判断游戏是否结束
   */
  isEnd: function () {
    return this.status == 'end';
  }
}

// 初始化
Game.init()
