// 画布
var canvas = document.getElementById('canvas')
var canvas1 = document.getElementById('canvas1')
var context = canvas.getContext('2d')
var context1 = canvas1.getContext('2d')
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
    var resources = opts.pieceSrc.concat([opts.imgdataSrc, opts.emptySrc, opts.fullSrc])

    var pieceNum = opts.pieceSrc.length
    this.st = new Date().getTime()
    util.resourceOnload(resources, function (images) {
      opts.pieceImgs = images.slice(0, pieceNum)
      opts.dataImg = images[pieceNum]
      opts.emptyImage = images[pieceNum + 1]
      opts.fullImage = images[pieceNum + 2]

      console.log('缓存图像完毕，距离开始：', (new Date()).getTime() - _self.st)
      // 创建触摸实例
      _self.touch = new Touch(canvas)
      // _self.setImgData()
      _self.play()
    })
  },
  setImgData: function () {
    var imgdataMsg = this.opts.imgdataMsg
    context.clearRect(0, 0, this.opts.designW, this.opts.designH)
    context.drawImage(this.opts.dataImg, imgdataMsg.x, imgdataMsg.y, imgdataMsg.w, imgdataMsg.h)
    this.opts.imgData = context.getImageData(0, 0, this.opts.designW, this.opts.designH)
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
    console.log('获取像素点完毕，距离开始：', (new Date()).getTime() - this.st)
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
    this.pieces = []
    for (var i = 0, len = opts.pieceSrc.length; i < len; i++) {
      var o = {
        msg: opts.pieceMsgs[i],
        img: opts.pieceImgs[i]
      }
      var opt = util.assign(opts, o)
      this.pieces[i] = new Piece(opt)
    }

    // 开始进行绘画更新
    console.log('创建对象完毕，距离开始', (new Date()).getTime() - this.st)
    this.total = opts.pieceSrc.length
    this.finish = 0
    this.drawOnce = true; // 第一次绘画
    this.changeToUp = -1; // 从下到上的 变化的碎片
    this.changeToDown = -1; // 从上到下变化的碎片
    this.pressIndex = -1
    this.releaseO = {length: 0}
    this.update()
    console.log('初次绘画完毕，距离开始：', (new Date()).getTime() - this.st)
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
    if (type == 'touchstart') {
    }else if (type == 'touchend') {
      var ex = this.touch.endX
      var ey = this.touch.endY
      ex = ex / clientWidth * this.opts.designW
      ey = ey / clientHeight * this.opts.designH
      this.releaseO = {length: 0}
      for (var i = 0, piece = null, len = this.pieces.length; i < len; i++) {
        piece = this.pieces[i]
        if (piece.isInTouch()) {
          if (this.round.isInArea(ex, ey)) {
            piece.createPath('end')
          } else {
            piece.createPath('start')
          }
          if (!this.releaseO[i]) {
            this.releaseO[i] = true
            this.releaseO.length++
          }
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

    // 更新对象数据 piece
    if (this.drawOnce) {
      this.drawOnce = false
      this.drawDown()
    }else {
      if (this.touch.isTouchStart || this.releaseO.length) {
        this.updatePieces()
        context.clearRect(0, 0, this.opts.designW, this.opts.designH)
        if (this.pressIndex != -1 || this.releaseO.length) {
          this.drawUp()
        }
        if (this.changeToUp != -1 || this.changeToDown != -1) {
          this.drawDown()
        }
      }
    }
    // this.draw()
    // 判断游戏是否结束
    if (this.isEnd()) {
      this.end()
    } else {
      setTimeout(function () {
        _self.update()
      }, 1000/60)
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

    // 手指不触碰的时候，并且手指未触碰过 或者 触碰了 (0,0)的地方则 返回
    if (!this.touch.isTouchStart && !sx && !sy) {
      return
    }

    // 归零参数
    var total = this.pieces.length
    var finish = 0
    this.changeToUp = -1; // 从下到上的 变化的碎片
    this.changeToDown = -1; // 从上到下变化的碎片
    this.pressIndex = -1
    this.releaseO = {length: 0}
    // 在 piece 前一次的各种状态下对它进行这次操作 // 开始状态，触碰状态，释放状态，目的地状态
    for (var i = 0, piece = null; i < total; i++) {
      piece = this.pieces[i]
      if (piece.isInStart()) {
        // 前次开始状态下，这次如果被点中触碰击态
        if (this.touch.isTouchStart && piece.isInArea(sx, sy)) {
          this.changeToUp = i
          this.pressIndex = i
          piece.setTouchLoc(sx, sy)
        }
      } else if (piece.isInTouch()) {
        // 前次触碰状态下，这次如果释放，变释放态或到目的地态，若一直触碰并移动，则跟着触碰设置位置
        if (this.touch.isTouchStart && this.touch.isTouchMove) {
          piece.setMoveLoc(mx, my)
          this.pressIndex = i
        } else if (!this.touch.isTouchStart) {
          // 触碰刚释放，需要看释放在什么位置；
          // touchend 触发函数
        }
      } else if (piece.isInRelease()) {
        // 前次释放状态下，如果回到初始态或结束态，否则继续移动 
        piece.step()
        if (!this.releaseO[i]) {
          this.releaseO[i] = true
          this.releaseO.length++
        }
        if (piece.isInEnd() || piece.isInStart()) {
          this.changeToDown = i
        }
      } else if (piece.isInEnd()) {
        if (this.releaseO[i]) {
          this.releaseO[i] = false
          this.releaseO.length--
        }
        this.finish++
      }
    }
    if (total == finish) {
      this.setStatus('end')
    }
  },
  drawDown: function () {
    if (this.isEnd()) {
      context1.clearRect(0, 0, this.opts.designW, this.opts.designH)
      this.roundfull.draw(context1)
      return
    }
    context1.clearRect(0, 0, this.opts.designW, this.opts.designH)
    // 先画圈的背景
    this.round.draw(context1)
    // 再画碎片
    for (var i = 0, len = this.pieces.length; i < len; i++) {
      var piece = this.pieces[i]
      if(piece.isInEnd() || piece.isInStart()){
        piece.draw(context1);
      }
    }
  },
  drawUp: function () {
    // 再画碎片
    var piece
    for (var key in this.releaseO) {
      if (key != 'length') {
        this.pieces[Number(key)].draw(context)
      }
    }
    if (this.pressIndex != -1) {
      this.pieces[this.pressIndex].draw(context)
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
Game.init()
