var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100,
    starNum: 3, // 星星数量
    fullSec: 10000, // 满分秒数
    
    containerSrc: ['images/cointarget.png','images/papertarget.png'],
    containerMsg: [{w:389,h:549,x:1226,y:917, type:'coin'},
        {w:657,h:557,x:270,y:928, type:'paper'}
    ],
    moneySrc: ['images/money1.png', 
    'images/money2.png', 
    'images/money3.png', 
    'images/money4.png',
    'images/money5.png',
    'images/money6.png',
    'images/money7.png',
    'images/money8.png'],
    moneyMsgs: [{w:255, h:259, startx:294, starty:283, type:'coin'},
    {w:226, h:226, startx:688, starty:159, type:'coin'},
    {w:199, h:199, startx:1081, starty:283, type:'coin'},
    {w:233, h:238, startx:1442, starty:199, type:'coin'},
    {w:333, h:177, startx:255, starty:565, type:'paper'},
    {w:179, h:179, startx:735, starty:459, type:'coin'},
    {w:333, h:177, startx:892, starty:695, type:'paper'},
    {w:333, h:177, startx:1321, starty:581, type:'paper'}],
    pressSrc: ['images/money1_press.png', 
    'images/money2_press.png', 
    'images/money3_press.png', 
    'images/money4_press.png',
    'images/money5_press.png',
    'images/money6_press.png',
    'images/money7_press.png',
    'images/money8_press.png'],
    pressMsgs: [{w:369, h:373, disx:-57, disy:-57},
    {w:339, h:340,  disx:-57, disy:-57},
    {w:311, h:311,  disx:-56, disy:-56},
    {w:347, h:352,  disx:-57, disy:-57},
    {w:449, h:293,  disx:-58, disy:-58},
    {w:291, h:291,  disx:-56, disy:-56},
    {w:449, h:293,  disx:-58, disy:-58},
    {w:449, h:293,  disx:-58, disy:-58}],
    
    speed: 80, // 释放时候碎片的速度
    maxTime: 5, //对应的速度最多能次数，大于这个次数，需要提速
    disappearTime:10 //到 终点持续ji秒之后消失
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