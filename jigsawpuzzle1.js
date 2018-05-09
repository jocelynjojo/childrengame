// 画布
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// 更新画布相关信息
var clientWidth = canvas.clientWidth;
var clientHeight = canvas.clientHeight;
console.log(clientWidth,clientHeight)

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
        var opts = Object.assign({}, opts, Config);
        opts.context = context;
        // 更新
        this.opts = opts;
        this.setStatus('start');

        var _self = this;
        // 加载资源图片, 加载完成交互才开始
        var resources = opts.normalSrc.concat(opts.pressSrc);
        resources.push(opts.emptySrc, opts.fullSrc);
        var pieceNum = opts.pieceNum;

        util.resourceOnload(resources, function (images) {
            opts.normalImgs = images.slice(0, pieceNum);
            opts.pressImgs = images.slice(pieceNum, 2 * pieceNum)
            opts.emptyImage = images[2 * pieceNum];
            opts.fullImage = images[2 * pieceNum + 1];
            _self.play()
        })
        
    },
    /** 
    * 更新游戏状态
    * @param {Staring} status //start:开始游戏， end：结束游戏
    */
    setStatus: function (status) {
        this.status = status;
    },
    play: function () {
        var _self = this;
        var opts = this.opts;
        // 创建圆形实例
        this.round = new Round(opts);
        this.round.setArea();
        
        // 创建碎片实例
        this.pieces = [];
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
            this.pieces[i] = new Piece(opt);
            this.pieces[i].setPointArea();
        }
        // 创建触摸实例
        this.touch = new Touch();
        // 开始进行绘画更新
        this.update();
    },
    /* 
    * 结束游戏，停止循环
    */
    end: function () {
        context.clearRect(0, 0, clientWidth, clientHeight);
        this.round.setStatus('full');
        this.touch.releaseEvent();
    },
    /*
    * 游戏每一帧的更新函数
    */
    update: function () {
        var _self = this;
        // 清除操作
        context.clearRect(0, 0, clientWidth, clientHeight)
        // 更新对象数据 piece
        this.updatePieces()
        
        // 绘制画布
        this.draw();
        // 判断游戏是否结束
        if (this.status == 'end'){
            this.end();
        }else{
            requestAnimFrame(function(){
                _self.update();
            })
        }
        
    },
    /*
    * 更新碎片对象
    */
    updatePieces: function () {
        var total = this.opts.pieceNum;
        var finish = 0;
        var piece;
        for(var i = 0; i < total; i++){
            piece = this.pieces[i]
            // 判断是否开始点击
            if(this.touch.isTouchStart){

            }else{

            }
            // 判断碎片到达了它末尾的位置
            if(piece.isInTheEnd()){
                finish ++;
                if(finish == total){
                    this.setStatus('end');
                }
            }
        }
    },
    draw: function () {
        // 先画圈的背景
        this.round.draw();
        // 再画碎片
        this.pieces.forEach(function (piece) {
            piece.draw()
        })
    }
}





// 初始化
Game.init()