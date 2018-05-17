var Config = {
    designW: 2048,
    designH: 1536,
    desighFont: 100,
    starNum: 3, // 星星数量
    imgdataSrc: 'images/imgDatabg.png',
    imgdataMsg: {w:1527, h:1182, x:252, y:216},

    emptySrc: 'images/jigsaw1_emptyround.png',
    fullSrc: 'images/jigsaw1_fullround.png',
    emptyMsg: {w:607, h:608, x:727, y:490, r:200, g:200, b:200, a:255},
    fullMsg: {w:607, h:607, x:727, y:489},
   
    pieceSrc: ['images/jigsaw1_piece_1.png', 
    'images/jigsaw1_piece_2.png', 
    'images/jigsaw1_piece_3.png', 
    'images/jigsaw1_piece_4.png',
    'images/jigsaw1_piece_5.png',
    'images/jigsaw1_piece_6.png'],
    pieceMsgs: [{w:230, h:341, startx:382, starty:261, endx:959, endy:755, r:180, g:180, b:180, a:255},
    {w:342, h:374, startx:252, starty:649, endx:992, endy:677, r:180, g:180, b:200, a:255},
    {w:197, h:336, startx:364, starty:1063, endx:776, endy:755, r:180, g:200, b:200, a:255},
    {w:165, h:374, startx:1468, starty:216, endx:727, endy:584, r:220, g:220, b:220, a:255},
    {w:352, h:302, startx:1427, starty:722, endx:960, endy:494, r:220, g:200, b:220, a:255},
    {w:286, h:281, startx:1427, starty:1091, endx:809, endy:488, r:220, g:200, b:200, a:255}],
    
    speed: 80, // 释放时候碎片的速度
    maxTime: 5 //对应的速度最多能次数，大于这个次数，需要提速
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

reConfig(Config);