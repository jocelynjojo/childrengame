var Config = {
    designW: 2048,
    designH: 1536,
    desighFont: 100,
    starNum: 3, // 星星数量
    finishbgSrc: 'images/finishbg.png',
    againSrc: 'images/btn_again.png',
    hanberSrc: 'images/btn_hanber.png',
    nextSrc: 'images/btn_next.png',
    brightSrc: 'images/star_bright.png',
    greySrc: 'images/star_gray.png',
    emptySrc: 'images/jigsaw1_emptyround.png',
    fullSrc: 'images/jigsaw1_fullround.png',
    finishbgMsg: {w:1050, h:704, x:536, y:400},
    againMsg: {w:203, h:107, disx:169, disy:474},
    hanberMsg: {w:203, h:113, disx:402, disy:479},
    nextMsg: {w:210, h:113, disx:621, disy:479},
    stars3Msgs: [{w:146, h:143, disx:198, disy:219},{w:146, h:143, disx:421, disy:219},{w:146, h:143, disx:643, disy:219}],
    pieceNum: 6,
    normalSrc: ['images/jigsaw1_piece_1.png', 
    'images/jigsaw1_piece_2.png', 
    'images/jigsaw1_piece_3.png', 
    'images/jigsaw1_piece_4.png',
    'images/jigsaw1_piece_5.png',
    'images/jigsaw1_piece_6.png'],
    pressSrc: ['images/jigsaw1_piece_1_press.png', 
    'images/jigsaw1_piece_2.png', 
    'images/jigsaw1_piece_3.png', 
    'images/jigsaw1_piece_4.png',
    'images/jigsaw1_piece_5.png',
    'images/jigsaw1_piece_6.png'],
    normalMsgs: [{w:230, h:341, startx:382, starty:261, endx:959, endy:755},
    {w:342, h:374, startx:252, starty:649, endx:992, endy:677},
    {w:197, h:336, startx:364, starty:1063, endx:776, endy:755},
    {w:352, h:302, startx:1427, starty:722, endx:960, endy:494},
    {w:286, h:281, startx:1427, starty:1091, endx:809, endy:488},
    {w:165, h:374, startx:1468, starty:216, endx:727, endy:584}],
    pressMsgs: [{w:337, h:446, disx:-56, disy:-48},
        {w:342, h:374, disx:0, disy:0},
        {w:197, h:336, disx:0, disy:0},
        {w:352, h:302, disx:0, disy:0},
        {w:286, h:281, disx:0, disy:0},
        {w:165, h:374, disx:0, disy:0},
    ],
    emptyMsg: {w:607, h:608, x:727, y:490},
    fullMsg: {w:607, h:607, x:727, y:489},
    toEndSpeed: 50, // 释放时候碎片的速度
    toStartSpeed: 80,
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