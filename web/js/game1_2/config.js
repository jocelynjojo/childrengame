var _dir = '../images/game1/';
var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100,
    starNum: 3, // 星星数量
    fullSec: 8000, // 满分秒数

    emptySrc: _dir + 'jigsaw1_emptyround.png',
    fullSrc: _dir + 'jigsaw1_fullround.png',
    emptyMsg: { w: 607, h: 608, x: 727, y: 490 },
    fullMsg: { w: 607, h: 607, x: 727, y: 489 },

    pieceSrc: [_dir + 'jigsaw1_piece_1.png',
    _dir + 'jigsaw1_piece_2.png',
    _dir + 'jigsaw1_piece_3.png',
    _dir + 'jigsaw1_piece_4.png',
    _dir + 'jigsaw1_piece_5.png',
    _dir + 'jigsaw1_piece_6.png'],
    pieceMsgs: [{ w: 230, h: 341, startx: 382, starty: 261, endx: 959, endy: 755 },
    { w: 342, h: 374, startx: 252, starty: 649, endx: 992, endy: 677 },
    { w: 197, h: 336, startx: 364, starty: 1063, endx: 776, endy: 755 },
    { w: 165, h: 374, startx: 1468, starty: 216, endx: 727, endy: 584 },
    { w: 352, h: 302, startx: 1427, starty: 722, endx: 960, endy: 494 },
    { w: 286, h: 281, startx: 1427, starty: 1091, endx: 809, endy: 488 }],
    pressSrc: [_dir + 'jigsaw1_piece_1_press.png',
    _dir + 'jigsaw1_piece_2_press.png',
    _dir + 'jigsaw1_piece_3_press.png',
    _dir + 'jigsaw1_piece_4_press.png',
    _dir + 'jigsaw1_piece_5_press.png',
    _dir + 'jigsaw1_piece_6_press.png'],
    pressMsgs: [{ w: 337, h: 446, disx: -56, disy: -48 },
    { w: 449, h: 477, disx: -50, disy: -52 },
    { w: 306, h: 441, disx: -52, disy: -53 },
    { w: 274, h: 471, disx: -57, disy: -49 },
    { w: 455, h: 407, disx: -51, disy: -52 },
    { w: 390, h: 391, disx: -53, disy: -57 }
    ],
    trancls: 'J-tran',
    releaseTime: 300,
    zIndex: 20
}
function reConfig(obj) {
    var canvas = document.getElementById('canvas')
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    var minus = 0, keystr = 'x';
    if (width / height > 1) {
        var w = Math.floor(width / height * obj.designH);
        minus = (w - obj.designW) / 2;
        obj.designW = w;
        canvas.width = w;
    } else {
        var h = Math.floor(height / width * obj.designW);
        minus = (h - obj.designH) / 2;
        obj.designH = h;
        canvas.height = h;
        keystr = 'y';
    }
    if (minus) {
        for (var key in obj) {
            var v = obj[key]
            if (Object.prototype.toString.call(v) == "[object Object]") {
                changeObj(v, minus, keystr);
            } else if (Object.prototype.toString.call(v) == "[object Array]") {
                for (var i = 0, len = v.length; i < len; i++) {
                    if (Object.prototype.toString.call(v[i]) == "[object Object]") {
                        changeObj(v[i], minus, keystr);
                    }
                }
            }
        }
    }
    canvas = null;

}
function changeObj(obj, minus, str) {
    if (str == 'x') {
        if (obj.x) {
            obj.x += minus;
        }
        if (obj.startx) {
            obj.startx += minus;
        }
        if (obj.endx) {
            obj.endx += minus;
        }
    } else if (str == 'y') {
        if (obj.y) {
            obj.y += minus;
        }
        if (obj.starty) {
            obj.starty += minus;
        }
        if (obj.endy) {
            obj.endy += minus;
        }
    }

}

