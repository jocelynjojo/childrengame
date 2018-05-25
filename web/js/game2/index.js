// 画布
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
// 屏幕宽高
var clientWidth = canvas.clientWidth
var clientHeight = canvas.clientHeight
// 分数
var gradewp = document.getElementById('js-gradewp');
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


    var _self = this
    // 加载资源图片, 加载完成交互才开始
    var resources = opts.moneySrc.concat(opts.pressSrc).concat(opts.containerSrc)
    // 获取资源数量
    var moneyNum = opts.moneySrc.length
    var conNum = opts.containerSrc.length
    // 加载
    this.st = new Date().getTime()
    util.resourceOnload(resources, function (images) {
      opts.moneyImgs = images.slice(0, moneyNum)
      opts.pressImgs = images.slice(moneyNum, moneyNum * 2)
      opts.containerImgs = images.slice(moneyNum * 2, conNum + moneyNum * 2)
      // 创建触摸实例
      console.log('缓存图像完毕，距离开始：', (new Date()).getTime() - _self.st)
      // 创建对象实例
      _self.createObj();
      console.log('创建对象完毕，距离开始', (new Date()).getTime() - _self.st)
      _self.play()
      console.log('初次绘画完毕，距离开始：', (new Date()).getTime() - _self.st)
      _self.addHandler();
    })
  },
  /**
   * 创建对象
   */
  createObj: function () {
    // 创建 触碰对象
    this.touch = new Touch(canvas)

    var opts = this.opts
    // 创建 容器实例
    this.containers = []
    for (var i = 0, len = opts.containerMsg.length; i < len; i++) {
      var o = {
        img: opts.containerImgs[i],
        msg: opts.containerMsg[i]
      }
      var opt = util.assign(opts, o)
      this.containers[i] = new Container(opt)
    }
    // 创建Money实例
    this.moneys = [], this.unfinish = []
    for (var i = 0, len = opts.moneyMsgs.length; i < len; i++) {
      var o = {
        img: opts.moneyImgs[i],
        msg: opts.moneyMsgs[i],
        pmsg: opts.pressMsgs[i],
        pimg: opts.pressImgs[i],
      }
      var opt = util.assign(opts, o)
      this.unfinish[i] = this.moneys[i] = new Money(opt)
    }
  },
  /**
   * 添加监听
   */
  addHandler: function () {
    var self = this;
    gradewp.addEventListener('touchstart', function (event) {
      var target = event.target;
      var id = target.id;
      if (target.id == 'js-again') {
        self.reset();
        self.play();
      } else if (target.id == 'js-hanber') {
        console.log('hanber')
      } else if (target.id == 'js-next') {
        console.log('next')
      }
    }, { passive: true })
    var r = document.getElementById('js-return');
    r.addEventListener('touchstart', function (event) {
      location.href = 'index.html'
    }, { passive: true });
  },
  /**
   * 回到初始状态
   */
  reset: function () {
    context.clearRect(0, 0, this.opts.designW, this.opts.designH)
    var total = this.unfinish.length = this.moneys.length;
    var money = null;
    for (var i = 0; i < total; i++) {
      money = this.moneys[i];
      money.reset();
      this.unfinish[i] = money;
    }
    gradewp.style.display = 'none';
  },

  /** 
  * 更新游戏状态
  * @param {Staring} status //start:开始游戏， end：结束游戏
  */
  setStatus: function (status) {
    this.status = status
  },
  play: function () {
    this.setStatus('start')
    this.drawOnce = true
    this.releaseNum = 0
    this.startPlayTime = new Date().getTime();
    this.update()
  },
  /* 
 * 结束游戏，停止循环
 */
  end: function () {
    console.log('end')
    this.showGrade()
    this.sendPass();
  },
  /**
   * 告诉后台过了这关
   */
  sendPass: function () {
    // Ajax.post({
    //   url: ''
    // })
  },
  /**
   * 展示分数
   */
  showGrade: function () {
    var playTime = (new Date()).getTime() - this.startPlayTime
    var percent = playTime / this.opts.fullSec;
    var starNum = this.opts.starNum;
    var className = gradewp.className.replace(/\s*js-star\d*/, '');
    if (percent > starNum - 1) {
      gradewp.className = className + ' js-star1';
    } else {
      gradewp.className = className + ' js-star' + (starNum - Math.floor(percent));
    }
    gradewp.style.display = 'block';
    console.log(playTime)
  },
  /**
   * game 被触发什么事件
   * @param {String} type 事件类型
   * @param {Object} extra 传参对象
   */
  trigger: function (type, extra) {
    if (type == 'touchend') {
      for (var i = 0, len = this.unfinish.length; i < len; i++) {
        if (this.unfinish[i].isInTouch()) {
          this.releaseNum++;
        }
      }
    }
  },
  /*
  * 游戏每一帧的更新函数
  */
  update: function () {
    var _self = this
    if (this.drawOnce || this.touch.isTouchStart || this.releaseNum) {
      this.drawOnce = false;
      // 清除操作
      context.clearRect(0, 0, this.opts.designW, this.opts.designH)
      // 更新对象数据 money
      this.updateMoneys()

      // 绘制画布
      this.draw()
    }

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
      return
    }
    // this.unfinish 是否还有对象, 没有对象则游戏结束
    var total = this.unfinish.length
    var money
    this.releaseNum = 0;
    // 在 money 前一次的各种状态下对它进行这次操作 // 开始状态，触碰状态，释放状态，目的地状态
    for (var i = 0; i < total; i++) {
      money = this.unfinish[i]
      if (money.isInStart()) {
        // 前次开始状态下，这次如果被点中触碰击态
        if (this.touch.isTouchStart && money.isInArea(sx, sy)) {
          money.setTouchLoc(sx, sy)
        }
      } else if (money.isInTouch()) {
        // 前次触碰状态下，这次如果释放，变释放态或到目的地态，若一直触碰并移动，则跟着触碰设置位置
        if (this.touch.isTouchStart && this.touch.isTouchMove) {
          money.setMoveLoc(mx, my)
        } else if (!this.touch.isTouchStart) {
          // 触碰刚释放，需要看释放在什么位置；
          var j = 0, l = this.containers.length, con = null
          for (; j < l; j++) {
            con = this.containers[j]
            if (con.type == money.type && con.isInArea(ex, ey)) {
              money.doInContainer()
              break
            }
          }
          // 上面如果通过break 跳出则是释放在对应的container, 否则则不对应，创建回去的路径
          if (j == l) {
            money.setBackPath()
          }
          this.releaseNum++;
        }
      } else if (money.isInRelease()) {
        // 前次释放状态下，如果回到初始位置变初始态，否则继续移动 
        money.step()
        this.releaseNum++;
      } else if (money.isInEnd()) {
        // 前次结束状态, 让他慢慢消失掉
        money.toDisappear()
        this.releaseNum++;
      } else if (money.isDisappear()) {
        this.unfinish.splice(i, 1)
        total--
        i--
        if (!total) {
          this.setStatus('end')
          return
        }
      }
    }
  },
  draw: function () {
    // 先画container
    for (var i = 0, len = this.containers.length; i < len; i++) {
      this.containers[i].draw()
    }
    // 再画money
    var money, releaseArr = [], touchIndex = -1
    for (var i = 0, len = this.unfinish.length; i < len; i++) {
      money = this.unfinish[i]
      if (money.isInTouch()) {
        touchIndex = i
      } else if (money.isInRelease()) {
        releaseArr.push(i)
      } else {
        money.draw()
      }
    }
    for (var i = 0, len = releaseArr.length; i < len; i++) {
      var index = releaseArr[i]
      this.unfinish[index].draw()
    }
    if (touchIndex != -1) {
      this.unfinish[touchIndex].draw()
    }
  },

  /**
   * 判断游戏是否结束
   */
  isEnd: function () {
    return this.status == 'end'
  }
}

// 初始化
// 改变根的字体大小
util.setFontSize(Config);
// 改变初始配置
reConfig(Config);
// 初始化
Game.init()

