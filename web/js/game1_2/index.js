// 屏幕宽高
var clientWidth = document.documentElement.clientWidth
var clientHeight = document.documentElement.clientHeight
// 分数
var con = document.getElementById('js-con2');
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
    // 更新
    this.opts = opts

    var _self = this
    // 加载资源图片, 加载完成交互才开始
    var resources = opts.pieceSrc.concat(opts.pressSrc).concat([opts.emptySrc])
 
    // 加载
    this.st = new Date().getTime()
    util.resourceOnload(resources, function (images) {
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
    // 初始化分数
    this.grade = Grade.init('js-gradewp');
    // 创建 触碰对象
    this.touch = new Touch(con)

    var opts = this.opts
    // 创建piece实例
    this.pieces = []
    for (var i = 0, len = opts.pieceMsgs.length; i < len; i++) {
      var msg = opts.pieceMsgs[i]
      var targetmsg = opts.emptyMsg;
      var el = document.createElement('img');
      el.src = opts.pieceSrc[i];
      el.className = 'piece2'
      var pel = document.createElement('img');
      pel.src = opts.pressSrc[i];
      pel.className = 'piece2'

      var o = {
        el: el,
        pel: pel,
        msg: this.getChangeMsg(opts.pieceMsgs[i]),
        pmsg: this.getChangeMsg(opts.pressMsgs[i]),
        targetmsg: this.getChangeMsg(targetmsg)
      }
      var opt = util.assign(opts, o)
      this.pieces[i] = new Piece(opt)
      con.appendChild(el);
      con.appendChild(pel)
    }

  },
  getChangeMsg: function (msg) {
    var obj = {}
    var percent = clientWidth / this.opts.designW
    if (msg.w && msg.h) {
      obj.w = msg.w * percent;
      obj.h = msg.h * percent;
    }
    if (msg.x && msg.y) {
      obj.x = msg.x * percent;
      obj.y = msg.y * percent;
    }
    if (msg.disx && msg.disy) {
      obj.disx = msg.disx * percent;
      obj.disy = msg.disy * percent;
    }
    if (msg.startx && msg.starty) {
      obj.startx = msg.startx * percent;
      obj.starty = msg.starty * percent;
    }
    if (msg.endx && msg.endy) {
      obj.endx = msg.endx * percent;
      obj.endy = msg.endy * percent;
    }
    if (msg.type) {
      obj.type = msg.type;
    }
    return obj;
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
  * 更新游戏状态
  * @param {Staring} status //start:开始游戏， end：结束游戏
  */
  setStatus: function (status) {
    this.status = status
  },
  /**
   * 回到初始状态
   */
  reset: function () {
    var piece = null;
    for (var i = 0, total = this.pieces.length; i < total; i++) {
      this.pieces[i].reset();
    }
  },
  play: function () {
    this.setStatus('start')
    this.opts.st = new Date().getTime();
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
    if (type == 'touchstart') {
      for (var i = 0, len = this.pieces.length; i < len; i++) {
        var piece = this.pieces[i]
        if (extra.tg == piece.pel && piece.isInStart() && !this.isEnd()) {
          piece.setTouchLoc(this.touch.startX,this.touch.startY);
          this.touchPiece = piece;
          this.update();
          break;
        }
      }
    }
    if (type == 'touchmove') {
      if (this.touchPiece) {
        this.touchPiece.setMoveLoc(this.touch.moveX, this.touch.moveY);
      }
    }
    if (type == 'touchend') {
      var tp = this.touchPiece;
      if (tp) {
        tp.release(this.touch.endX, this.touch.endY)
        if (this.isEnd()) {
          var self = this;
          setTimeout(function () {
            self.end()
          }, this.opts.releaseTime + 100)
        }
        this.touchPiece = null;
      }
    }
  },
  /*
  * 游戏每一帧的更新函数
  */
  update: function () {
    if (this.touch.isTouchStart && this.touchPiece) {
      this.touchPiece.draw();
      cancelAnimFrame(this.timer);
      this.timer = requestAnimFrame(this.update.bind(this));
    }
  },

  /**
   * 判断游戏是否结束
   */
  isEnd: function () {
    for (var i = 0, len = this.pieces.length; i < len; i++) {
      if (!this.pieces[i].isInEnd()) {
        return false;
      }
    }
    return true;
  }
}

// 初始化
// 改变根的字体大小
util.setFontSize(Config);
// 改变初始配置
// reConfig(Config);
// 初始化
Game.init()

