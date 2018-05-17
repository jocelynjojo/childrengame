
var Game = {
    init: function (opts) {
        var main = document.getElementById('canvas');
        this.opts = opts;
        // 初始化zrender
        var zr = zrender.init(main, { width: opts.designW, height: opts.designH });
        this.pieces = []
        for (var i = 0, len = opts.pieceSrc; i < len; i++) {
            var msg = opts.pieceMsgs[i];
            var src = opts.pieceSrc[i];
            var image = new zrender.Image({
                position: [msg.startx, msg.starty],
                scale: [1, 1],
                style: {
                    x: 0,
                    y: 0,
                    image: src,
                    width: 20,
                    height: 20
                },
                draggable: true,
                shadowBlur: 80,
                shadowColor: 'rgba(0,0,0,0.8)',
                shadowOffsetX: 5,
                shadowOffsetY: 5,
            });
            zr.add(image);
            this.pieces.push(image);
        }
    }
}


Game.init(Config);