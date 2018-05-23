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
    opts.context1 = context1;
    // 更新
    this.opts = opts
    this.setStatus('start')

    var _self = this
    // 加载资源图片, 加载完成交互才开始
    var resources = opts.pieceSrc.concat(opts.pressSrc).concat([opts.imgdataSrc, opts.emptySrc, opts.fullSrc])

    var pieceNum = opts.pieceSrc.length
    this.st = new Date().getTime()
    util.resourceOnload(resources, function (images) {
      opts.pieceImgs = images.slice(0, pieceNum)
      opts.pressImgs = images.slice(pieceNum, pieceNum * 2)
      opts.dataImg = images[pieceNum * 2]
      opts.emptyImage = images[pieceNum * 2 + 1]
      opts.fullImage = images[pieceNum * 2 + 2]

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
        img: opts.pieceImgs[i],
        pmsg: opts.pressMsgs[i],
        pimg: opts.pressImgs[i],
      }
      var opt = util.assign(opts, o)
      this.pieces[i] = new Piece(opt)
    }

    // 开始进行绘画更新
    console.log('创建对象完毕，距离开始', (new Date()).getTime() - this.st)
    this.total = opts.pieceSrc.length
    this.finish = 0
    this.drawOnce = true;

    // 设置 touchstart 的 初始参数
    this.isInTouch = false;
    this.touchIndex = -1;
    this.doInStart = 0;
    // 设置 touchend 的初始参数
    this.releaseObjArr = { length: 0 };
    // 设置 end 初始参数
    this.endObjArr = { length: 0 };
    this.pieceEnd = false;
    // 开始更新
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
      var sx = this.touch.startX
      var sy = this.touch.startY
      sx = sx / clientWidth * this.opts.designW
      sy = sy / clientHeight * this.opts.designH
      for (var i = 0, total = this.pieces.length, piece = null; i < total; i++) {
        piece = this.pieces[i]
        if (piece.isInStart() && piece.isInArea(sx, sy)) {
          // 前次开始状态下，这次如果被点中触碰击态
          this.isInTouch = true;
          this.touchIndex = i;
          this.doInStart = 0;
          piece.setTouchLoc(sx, sy); // 设置击中位置以及piece 设置为点击状态
          break;
        }
      }
    } else if (type == 'touchend') {

      // 获取touchend 的手指参数
      var ex = this.touch.endX
      var ey = this.touch.endY
      ex = ex / clientWidth * this.opts.designW
      ey = ey / clientHeight * this.opts.designH
      var index = this.touchIndex; //获取被触碰的碎片index;
      if (index != -1) {
        var piece = this.pieces[index];
        // 触碰刚释放，需要看释放在什么位置；创建路径，piece设置为释放状态
        if (this.round.isInArea(ex, ey)) {
          piece.createPath('end')
        } else {
          piece.createPath('start')
        }
        if (!this.releaseObjArr[index]) {
          this.releaseObjArr[index] = true;
          this.releaseObjArr.length++;
        }
      }
      // 还原touchstart 的参数设置
      this.isInTouch = false;
      this.touchIndex = -1;
      this.doInStart = 0;

    } else if (type == 'pieceend') {
      if (extra.endIndex != -1) {
        var endIndex = extra.endIndex;
        if (this.releaseObjArr[endIndex]) {
          this.releaseObjArr[endIndex] = false;
          this.releaseObjArr.length--;
        }
        if (this.pieces[endIndex].isInEnd() && !this.endObjArr[endIndex]) {
          this.endObjArr[endIndex] = true;
          this.endObjArr.length++;
          if (this.endObjArr.length == this.pieces.length) {
            this.setStatus('end');
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
    // 绘制画布
    if (this.drawOnce || this.isInTouch || this.releaseObjArr.length > 0) {
      // 更新对象数据 piece
      if (this.drawOnce) {
        this.drawAllExcept(-1);
        this.drawOnce = false;
      } else {
        if (this.isInTouch && this.doInStart == 0) {
          this.doInStart++;
          this.drawUp();
          this.drawAllExcept(this.touchIndex)
        } else {
          this.updatePieces();
          if(this.isEnd()){
            this.drawUp()
             this.drawAllExcept()
          }else if (this.pieceEnd) {
            this.drawAllExcept(this.releaseObjArr)
            this.drawUp()
          }else{
            this.drawUp()
          }
        }
      }
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
    var mx = this.touch.moveX
    var my = this.touch.moveY
    mx = mx / clientWidth * this.opts.designW
    my = my / clientHeight * this.opts.designH
    this.pieceEnd = false;
    // 在 piece 前一次的各种状态下对它进行这次操作 // 开始状态，触碰状态，释放状态，目的地状态
    for (var i = 0, total = this.pieces.length, piece = null; i < total; i++) {
      piece = this.pieces[i]
      // 前一秒处于开始状态，后一秒触碰的操作，在touchstart中精细，并设置为touch 状态
      if (piece.isInTouch()) {
        // 前次触碰状态下，若一直触碰并移动，则跟着触碰设置位置，这个不在touchmove中进行，原因是move频繁，但是显示的时候才需计算
        if (this.touch.isTouchStart && this.touch.isTouchMove) {
          piece.setMoveLoc(mx, my)
        }
        // 前次触碰状态下，后一秒释放的释放操作，在 touenend 中进行,设施为release

      } else if (piece.isInRelease()) {
        // 前次释放状态下，如果回到初始态或结束态，否则继续移动 
        piece.step()
        if (piece.isInEnd() || piece.isInStart()) {
          this.pieceEnd = true;
          this.trigger('pieceend', { endIndex: i });
        }
      }
    }
  },
  /**
   * 画出除了传值以外的所有碎片和圈圈背景
   * @param {object|number} arg  释放对象 | 第n碎片，下标从 0 开始
   */
  drawAllExcept: function (arg) {
    // 先画圈的背景
    context1.clearRect(0, 0, this.opts.designW, this.opts.designH);
    if(this.isEnd()){
      this.roundfull.draw();
      return;
    }
    this.round.draw()
    if (Object.prototype.toString.call(arg) == "[object Object]") {
      for (var i = 0, len = this.pieces.length; i < len; i++) {
        if (!arg[i]) {
          this.pieces[i].draw();
        }
      }
    } else {
      for (var i = 0, len = this.pieces.length; i < len; i++) {
        if (arg != i) {
          this.pieces[i].draw();
        }
      }
    }

  },
  drawUp: function () {
    // 再画碎片
    var piece, len = this.pieces.length, i = 0;
    for (i = 0; i < len; i++) {
      piece = this.pieces[i]
      piece.clearCans();
    }
    for(i = 0; i < len; i++){
      piece = this.pieces[i]
      if(this.releaseObjArr[i]){
        piece.draw()
      }
    }
    
    if (this.touchIndex != -1) {
      this.pieces[this.touchIndex].draw()
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
reConfig(Config);
Game.init()
