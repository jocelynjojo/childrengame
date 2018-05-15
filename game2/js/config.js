var Config = {
    designW: 2048,
    designH: 1536,
    canvas:document.getElementById('canvas'),
    imgdataSrc: 'images/imgdata.jpg',
    imgdataMsg: {w:1420, h:1335, x:225, y:159},
    coinSrc: 'images/cointarget.png',
    paperSrc: 'images/papertarget.png',
    coinMsg: {w:389,h:549,x:1226,y:917, r:200, g:200, b:200, a:255},
    paperMsg: {w:657,h:557,x:270,y:928, r:180, g:200, b:200, a:255},
    moneyNum: 8,
    moneySrc: ['images/money1.png', 
    'images/money2.png', 
    'images/money3.png', 
    'images/money4.png',
    'images/money5.png',
    'images/money6.png',
    'images/money7.png',
    'images/money8.png'],
    moneyMsgs: [{w:255, h:259, startx:294, starty:283, r:180, g:180, b:160, a:255},
    {w:226, h:226, startx:688, starty:159, r:160, g:180, b:180, a:255},
    {w:199, h:199, startx:1081, starty:283, r:180, g:180, b:180, a:255},
    {w:233, h:238, startx:1442, starty:199, r:180, g:200, b:180, a:255},
    {w:333, h:177, startx:255, starty:565, r:200, g:180, b:180, a:255},
    {w:179, h:179, startx:735, starty:459, r:180, g:180, b:200, a:255},
    {w:333, h:177, startx:892, starty:695, r:200, g:180, b:200, a:255},
    {w:333, h:177, startx:1321, starty:581, r:200, g:200, b:180, a:255}],
    
    speed: 80, // 释放时候碎片的速度
    maxTime: 5, //对应的速度最多能次数，大于这个次数，需要提速
    disappearTime:3 //到 终点持续ji秒之后消失
}
function reConfig(obj) {
    var canvas = obj.canvas;
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