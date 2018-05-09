// 画布
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
// 屏幕宽高
var clientWidth = document.clientWidth
var clientHeight = document.clientHeight

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
    var opts = Object.assign({}, opts, Config)
    opts.context = context
    // 更新
    this.opts = opts
    this.setStatus('start')

    var _self = this
    // 加载资源图片, 加载完成交互才开始
    var resources = opts.normalSrc.concat(opts.pressSrc)
    resources.push(opts.emptySrc, opts.fullSrc)
    var pieceNum = opts.pieceNum

    util.resourceOnload(resources, function (images) {
      opts.normalImgs = images.slice(0, pieceNum)
      opts.pressImgs = images.slice(pieceNum, 2 * pieceNum)
      opts.emptyImage = images[2 * pieceNum]
      opts.fullImage = images[2 * pieceNum + 1]
      _self.play()
    })
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
    var opts = this.opts
    // 创建圆形实例
    this.round = new Round(opts)

    // 创建碎片实例
    this.pieces = []
    for (var i = 0, len = opts.pieceNum; i < len; i++) {
      var opt = {
        context: context,
        normalMsg: opts.normalMsgs[i],
        pressMsg: opts.pressMsgs[i],
        normalImg: opts.normalImgs[i],
        pressImg: opts.pressImgs[i],
        speed: opts.speed,
        designW: opts.designW,
        designH: opts.designH
      }
      this.pieces[i] = new Piece(opt)
    }
    // 创建触摸实例
    this.touch = new Touch()

    // 开始进行绘画更新
    this.update()
  },
  /* 
  * 结束游戏，停止循环
  */
  end: function () {
    context.clearRect(0, 0, this.opts.designW, this.opts.designW)
    this.round.setStatus('full')
    this.touch.releaseEvent()
  },
  /*
  * 游戏每一帧的更新函数
  */
  update: function () {
    var _self = this
    // 清除操作
    context.clearRect(0, 0, this.opts.designW, this.opts.designW)
    // 更新对象数据 piece
    this.updatePieces()

    // 绘制画布
    this.draw()
    // 判断游戏是否结束
    if (this.status == 'end') {
      this.end()
    }else {
      requestAnimFrame(function () {
        _self.update()
      })
    }
  },
  /*
  * 更新碎片对象
  */
  updatePieces: function () {
    var total = this.opts.pieceNum
    var finish = 0
    var piece
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

    // 被点击的碎片的index
    var pressIndex = -1;
    // 循环判断是否有碎片处于点击状态
    for (var i = 0; i < total; i++){
        if(this.pieces[i].status == 'press'){
            pressIndex = i;
            break;
        }
    }
    // 如果碎片不等于 -1 说明有碎片处于点击态
    if(pressIndex != -1){
        
    }else{

    }
    for (var i = 0; i < total; i++) {
      piece = this.pieces[i]

      // 判断是否开始点击
      if (this.touch.isTouchStart) {
        piece.setStatus('press')
        var x = this.touch.startX
        var y = this.touch.startY
        if (this.touch.isTouchMove) {
          x = this.touch.moveX
          y = this.touch.moveY
        }
        x = x / clientWidth * this.opts.designW
        y = y / clientHeight * this.opts.designH
      }else {
        // 如果手指没有点击，有两种情况 1 手指一直没有点击 2 手指刚放开，碎片回复或者移动到终点
        if (piece.isBeenMove() && !(piece.isInTheEnd())) {
          // 如果手指刚放开 ， 判断手指所在的位置是否到达 圆圈内
          if (this.round.isInArea(ex, ey)) {
            piece.translate('end')
          }else {
            piece.translate('start')
          }
        }
      }
      // 判断碎片到达了它末尾的位置
      if (piece.isInTheEnd()) {
        finish++
        if (finish == total) {
          this.setStatus('end')
        }
      }
    }
  },
  draw: function () {
    // 先画圈的背景
    this.round.draw()
    // 再画碎片
    this.pieces.forEach(function (piece) {
      piece.draw()
    })
  }
}

// 初始化
Game.init()
