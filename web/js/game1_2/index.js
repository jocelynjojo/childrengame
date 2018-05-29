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
    var resources = opts.pieceSrc.concat(opts.pressSrc).concat([opts.emptySrc, opts.fullSrc])

    var pieceNum = opts.pieceSrc.length
    this.st = new Date().getTime()
    util.resourceOnload(resources, function (images) {
      opts.pieceImgs = images.slice(0, pieceNum)
      opts.pressImgs = images.slice(pieceNum, pieceNum * 2)
      opts.emptyImage = images[pieceNum * 2]
      opts.fullImage = images[pieceNum * 2 + 1]

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
    // 创建圆形对象
    var opts = this.opts
    // 创建空心圆形实例
    var o = {
      img: opts.emptyImage,
      msg: opts.emptyMsg
    }
    var opt = util.assign(opts, o)
    this.round = new Round(opt)
    // 创建实心原型实例
    var o = {
      img: opts.fullImage,
      msg: opts.fullMsg
    }
    var opt = util.assign(opts, o)
    this.roundfull = new Round(opt)
    // 创建碎片实例
    this.pieces = [], this.unfinish = []
    for (var i = 0, len = opts.pieceSrc.length; i < len; i++) {
      var o = {
        msg: opts.pieceMsgs[i],
        img: opts.pieceImgs[i],
        pmsg: opts.pressMsgs[i],
        pimg: opts.pressImgs[i],
      }
      var opt = util.assign(opts, o)
      this.unfinish[i] = this.pieces[i] = new Piece(opt)
    }
    // 初始化分数
    this.grade = Grade.init('js-gradewp');
  },
  /**
   * 添加监听
   */
  addHandler: function () {

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
    var total = this.unfinish.length = this.pieces.length;
    var piece = null;
    for (var i = 0; i < total; i++) {
      piece = this.pieces[i];
      piece.reset();
      this.unfinish[i] = piece;
    }
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
    this.drawOnce = true;
    this.releaseNum = 0;
    this.opts.st = new Date().getTime();
    this.update()
  },
  /* 
  * 结束游戏，停止循环
  */
  end: function () {
    console.log('end')
    this.grade.show(this.opts);
    // this.grade.sendMsg();
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
    // 清除操作

    // 绘制画布
    if (this.drawOnce || this.touch.isTouchStart || this.releaseNum) {
      context.clearRect(0, 0, this.opts.designW, this.opts.designH)
      // 更新对象数据 piece

      this.updatePieces()
      this.drawOnce = false;
      this.draw()
    }
    // this.draw()
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
  updatePieces: function () {
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
    this.releaseNum = 0;
    var total = this.unfinish.length
    var piece

    // 在 piece 前一次的各种状态下对它进行这次操作 // 开始状态，触碰状态，释放状态，目的地状态
    for (var i = 0; i < total; i++) {
      piece = this.unfinish[i]
      if (piece.isInStart()) {
        // 前次开始状态下，这次如果被点中触碰击态
        if (this.touch.isTouchStart && piece.isInArea(sx, sy)) {
          piece.setTouchLoc(sx, sy)
        }
      } else if (piece.isInTouch()) {
        // 前次触碰状态下，这次如果释放，变释放态或到目的地态，若一直触碰并移动，则跟着触碰设置位置
        if (this.touch.isTouchStart && this.touch.isTouchMove) {
          piece.setMoveLoc(mx, my)
        } else if (!this.touch.isTouchStart) {
          // 触碰刚释放，需要看释放在什么位置；
          if (this.round.isInArea(ex, ey)) {
            piece.createPath('end')
          } else {
            piece.createPath('start')
          }
          this.releaseNum++;
        }

      } else if (piece.isInRelease()) {
        // 前次释放状态下，如果回到初始态或结束态，否则继续移动 
        piece.step()
        this.releaseNum++;
      } else if (piece.isInEnd()) {
        this.unfinish.splice(i, 1)
        total--
        i--
        if (!total) {
          this.setStatus('end')
          return
        }
      } else {
        continue
      }
    }
  },
  draw: function () {
    if (this.isEnd()) {
      this.roundfull.draw()
      return
    }
    // 先画圈的背景
    this.round.draw()
    // 再画碎片
    var piece, pressIndex = -1, pathIndex = -1
    for (var i = 0, len = this.pieces.length; i < len; i++) {
      piece = this.pieces[i]
      if (piece.isInTouch()) {
        pressIndex = i
      } else if (piece.isInRelease()) {
        pathIndex = i
      } else {
        piece.draw()
      }
    }
    if (pathIndex != -1) {
      this.pieces[pathIndex].draw()
    }
    if (pressIndex != -1) {
      this.pieces[pressIndex].draw()
    }
  },

  /**
   * 判断游戏是否结束
   */
  isEnd: function () {
    return this.status == 'end'
  }
}

// 改变根的字体大小
util.setFontSize(Config);
// 改变初始配置
reConfig(Config);
// 初始化
Game.init()
