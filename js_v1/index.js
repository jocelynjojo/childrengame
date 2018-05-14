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
    var opts = Object.assign({}, opts, Config)
    opts.context = context
    // 更新
    this.opts = opts
    this.setStatus('ready')

    var _self = this
    // 加载资源图片, 加载完成交互才开始
    var resources = opts.normalSrc.concat(opts.pressSrc)
    resources.push(opts.emptySrc, opts.fullSrc, opts.finishbgSrc, opts.againSrc, opts.hanberSrc, opts.nextSrc, opts.brightSrc, opts.greySrc)
    var pieceNum = opts.pieceNum

    util.resourceOnload(resources, function (images) {
      opts.normalImgs = images.slice(0, pieceNum)
      opts.pressImgs = images.slice(pieceNum, 2 * pieceNum)
      opts.emptyImage = images[2 * pieceNum]
      opts.fullImage = images[2 * pieceNum + 1]
      opts.finishbgImg = images[2 * pieceNum + 2]
      opts.againImg = images[2 * pieceNum + 3]
      opts.hanberImg = images[2 * pieceNum + 4]
      opts.nextImg = images[2 * pieceNum + 5]
      opts.brightImg = images[2 * pieceNum + 6]
      opts.greyImg = images[2 * pieceNum + 7]
      // 创建触摸实例
      _self.touch = new Touch()
      _self.play()
    })
  },
  /** 
  * 更新游戏状态
  * @param {Staring} status //ready:准备开始游戏 start:开始游戏， end：结束游戏
  */
  setStatus: function (status) {
    this.status = status
  },
  play: function () {
    this.setStatus('start');
    var _self = this
    var opts = this.opts
    // 创建分数实例
    this.grade = new Grade(opts);
    // 创建圆形实例
    this.round = new Round(opts)

    // 创建碎片实例
    this.pieces = []
    for (var i = 0, len = opts.pieceNum; i < len; i++) {
      var opt = {
        normalMsg: opts.normalMsgs[i],
        pressMsg: opts.pressMsgs[i],
        normalImg: opts.normalImgs[i],
        pressImg: opts.pressImgs[i]
      }
      this.pieces[i] = new Piece(opts, opt)
    }

    // 开始进行绘画更新
    console.log('准备开始进行绘画更新')
    this.update()
  },
  clearAll: function () {
    this.clearUpdate();
    this.grade.clearAll();
    this.grade = null;
  },
  clearUpdate: function () {
    this.round = null;
    this.pieces = [];
    this.touch.reset();
  },
  /* 
  * 结束游戏，停止循环
  */
  end: function () {
    context.clearRect(0, 0, this.opts.designW, this.opts.designH)
    this.round.setStatus('full')
    this.touch.releaseEvent()
    this.lastDraw();
    this.clearUpdate();
  },
  /**
   * game 被触发什么事件
   * @param {String} type 事件类型
   * @param {Object} extra 传参对象
   */
  trigger: function (type, extra) {
    if (type == 'tap') {
      this.tabEvent(extra)
    }
      },
  tabEvent: function (extra) {

    if (this.isEnd()) {
      var x = extra.tapx;
      var y = extra.tapy;
      x = x / clientWidth * this.opts.designW
      y = y / clientHeight * this.opts.designH
      if (this.grade.isInAgain(x, y)) {
        this.setStatus('start')
        this.clearAll();
        this.play();
      }
    }
  },
  /*
  * 游戏每一帧的更新函数
  */
  update: function () {
    var _self = this
    // 清除操作
    context.clearRect(0, 0, this.opts.designW, this.opts.designH)
    // 更新对象数据 piece
    this.updatePieces()

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
    if (!sx && !sy && !mx && !my) {
      return;
    }
    
    // 判断手指是否在点击canvas
    if (this.touch.isTouchStart) {
      for (var i = 0; i < total; i++) {
        piece = this.pieces[i]
        // 是否碎片已经是点中状态
        if (piece.isPressed()) {
          if (this.touch.isTouchMove) {
            // 如果手指进行了移动，则移动碎片设置碎片位置，否则不作为
            piece.setLoc(mx, my);
          }
        } else if (piece.isInArea(sx, sy) && !(piece.isInPath())) {
          //判断是否点钟碎片，如果点中，则设置碎片状态，为点中状态
          piece.setStatus('press');
          piece.setTouchDis(sx, sy);
          break;
        }
      }
    } else {
      //如果没有点击 1、一直没有点击则不作为， 2 手指放开，碎片恢复或移动到终点
      var finishIndex = -1;
      for (var i = 0; i < total; i++) {
        piece = this.pieces[i]
        piece.setStatus('normal');
        //如果碎片在终点
        if (piece.isInTheEnd()) {
          finish++;
          if (finish == total) {
            this.setStatus('end');
          }
        } else if (!(piece.isInStart())) {
          // 如果碎片不在终点也不在起点， 判断手指所在的位置是否到达 圆圈内
          if (piece.hasPath()) {
            piece.translate()
          } else {
            if (this.round.isInArea(ex, ey)) {
              piece.createPath(ex, ey, 'end')

            } else {
              piece.createPath(ex, ey, 'start')
            }
          }
        }
      }

    }
  },
  draw: function () {
    // 先画圈的背景
    this.round.draw()
    // 再画碎片
    var piece, pressIndex = -1;
    for (var i = 0, len = this.pieces.length; i < len; i++) {
      piece = this.pieces[i];
      if (piece.isPressed()) {
        pressIndex = i;
      } else {
        piece.draw();
      }
    }
    if (pressIndex != -1) {
      this.pieces[pressIndex].draw();
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
