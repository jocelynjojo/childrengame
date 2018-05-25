var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
var clientWidth = canvas.clientWidth;
var clientHeight = canvas.clientHeight;

var Game = {
    init: function (opts) {
        this.opts = opts;
        this.opts.context = context;
        var self = this;
        this.ready = { loaded: false, getData: false };
        var arr = opts.animalSrcs.concat(opts.birdSrcs)
            .concat(opts.medalSrcs)
            .concat(opts.giftSrc)
            .concat([opts.greySrc, opts.brightSrc])
        var alen = opts.animalSrcs.length;
        var blen = opts.birdSrcs.length;
        var mlen = opts.medalSrcs.length;
        var glen = opts.giftSrc.length;
        var len = alen + blen + mlen + glen;
        util.resourceOnload(arr, function (images) {
            opts.animalImgs = images.slice(0, alen);
            opts.birdImgs = images.slice(alen, alen + blen);
            opts.medalImgs = images.slice(alen + blen, alen + blen + mlen);
            opts.giftImgs = images.slice(alen + blen + mlen, len);
            opts.greyImg = images[len];
            opts.brightImg = images[len + 1];

            self.trigger('loaded');
        })
        this.getData();
    },
    getData: function () {
        setTimeout(this.trigger.bind(this, 'getData'), 500)
    },
    trigger: function (type) {
        if (type == 'loaded') {
            this.ready.loaded = true;
        } else if (type == 'getData') {
            this.ready.getData = true;
        }
        this.isAllReady();
    },
    isAllReady: function () {
        var allReady = true;
        for (var key in this.ready) {
            if (!this.ready[key]) {
                allReady = false;
            }
        }
        if (allReady) {
            this.createObj({
                levelList: [
                    {
                        "isFinished": true,
                        "myPrize": {
                            "PrizeID": 1,
                            "PrizeName": "星星",
                            "PrizeType": 1001,
                            "Money": null,
                            "ImageUrl": null,
                            "CreateTime": null,
                            "IsValid": true
                        },
                        "GameID": 1,
                        "GameName": "认识硬币",
                    },
                    {
                        "isFinished": true,
                        "myPrize": {
                            "PrizeID": 1,
                            "PrizeName": "星星",
                            "PrizeType": 1001,
                            "Money": null,
                            "ImageUrl": null,
                            "CreateTime": null,
                            "IsValid": true
                        },
                        "GameID": 2,
                    },
                    {
                        "isFinished": true,
                        "myPrize": {
                            "PrizeID": 2,
                            "PrizeName": "赚钱勋章",
                            "PrizeType": 1002,
                            "Money": null,
                            "ImageUrl": null,
                            "CreateTime": null,
                            "IsValid": true
                        }
                    },
                    {
                        "isFinished": true,
                        "myPrize": {
                            "PrizeID": 2,
                            "PrizeName": "赚钱勋章",
                            "PrizeType": 1002,
                            "Money": null,
                            "ImageUrl": null,
                            "CreateTime": null,
                            "IsValid": true
                        }
                    },
                    {
                        "isFinished": true,
                        "myPrize": {
                            "PrizeID": 2,
                            "PrizeName": "赚钱勋章",
                            "PrizeType": 1002,
                            "Money": null,
                            "ImageUrl": null,
                            "CreateTime": null,
                            "IsValid": true
                        }
                    }
                    
                ]
            });
            this.addEvent();
            this.draw();
        }
    },

    createObj: function (data) {
        var opts = this.opts;
        var birdIndex = 0;
        var animalIndex = 0;
        var levelList = data.levelList;
        this.levList = [];
        for (var i = 0, len = opts.levelsMsg.length; i < len; i++) {
            var lve = data.levelList[i];
            if(!lve){
                // 如果返回的关卡数量不足定义的关卡数量，自定义
                lve = {
                    isFinished: false
                }
            }
            var o = {
                level: i,
                baseMsg: opts.levelsMsg[i],
            }
            if (lve.isFinished) {
                o.status = 'success'
                if (!data.levelList[i + 1] || !data.levelList[i + 1].isFinished) {
                    this.level = i;
                    o.status = 'now'
                    switch (i) {
                        case 0: case 1: case 2:
                            birdIndex = 0;
                            break;
                        case 4:
                            birdIndex = 1;
                            break;
                    }
                    var birdMsg = opts.birdMsgs[birdIndex];
                    var greyMsg = opts.greyMsg;
                    o.nowMsgs = [
                        util.assign({ img: opts.animalImgs[animalIndex] }, opts.animalMsg),
                        { img: opts.birdImgs[birdIndex], w: birdMsg.w, h: birdMsg.h, disx: greyMsg.w / 2 - birdMsg.w, disy: 30 - birdMsg.h }
                    ]
                }
            } else {
                o.status = 'start'
            }
            if (lve.myPrize) {
                switch (lve.myPrize.PrizeType) {
                    case 1001: o.successImg = opts.brightImg;
                        o.successMsg = opts.brightMsg;
                        break;
                    case 1002:
                        o.successImg = opts.medalImgs[0];
                        o.successMsg = opts.medalMsgs[0];
                        break;
                }
            }
            if(opts.levelsExtra[i]){
                o.extraMsgs = opts.levelsExtra[i];
            }
            this.levList[i] = new LevelO(util.assign(o, opts));
        }
    },
    addEvent: function (type) {
        var self = this;
        canvas.addEventListener('touchstart', function (event) {
            event.stopPropagation();
            event.preventDefault()
            self.playGame(event);
        }, { passive: false });
        var doc = document;
        var s = doc.getElementById('js-switch');
        s.addEventListener('touchstart', function (event) {
            console.log('switch')
        }, { passive: true });
        var btnwp = doc.getElementById('js-btnwp');
        btnwp.addEventListener('touchstart', function (event) {
            var tg = event.target;
            if (tg.id == 'js-btnstar') {
                location.href = 'starlist.html'
            }
            if (tg.id == 'js-btnmedal') {
                location.href = 'medallist.html'
            }
            if (tg.id == 'js-btncertificate') {
                console.log('btncertificate')
            }
            if (tg.id == 'js-btngrow') {
                console.log('js-btngrow')
            }
            if (tg.id == 'js-btnflower') {
                console.log('js-btnflower')
            }
            if (tg.id == 'js-btntime') {
                console.log('js-btntime')
            }
        }, { passive: true });
        var btnwp1 = doc.getElementById('js-btnwp1');
        btnwp1.addEventListener('touchstart', function (event) {
            var tg = event.target;
            if (tg.id == 'js-weibo') {
                console.log('js-weibo')
            }
            if (tg.id == 'js-wx') {
                console.log('js-wx')
            }
        }, { passive: true });
    },
    draw: function () {
        context.clearRect(0, 0, this.opts.designW, this.opts.designH)
        for (var i = 0, len = this.levList.length; i < len; i++) {
            this.levList[i].draw();
        }
    },
    playGame: function (event) {
        var touches = event.touches[0];
        var sx = touches.clientX;
        var sy = touches.clientY;
        sx = sx / clientWidth * this.opts.designW;
        sy = sy / clientHeight * this.opts.designH;
        for (var i = 1, allNum = this.opts.allNum; i < allNum; i++) {
            var str = 'level' + i;
            var level = this.opts.tree[str];
            var base = level.base || { x: 0, y: 0, w: 0, h: 0 };
            if (sx >= base.x && sx <= base.x + base.w && sy >= base.y && sy <= base.y + base.h) {
                console.log('game' + i)
                break;
            }
        }
    }
}
function LevelO(opts) {
    this.opts = util.assign(opts);

    this.level = opts.level;
    this.ctx = opts.context;
    this.status = opts.status; // 'start','now','success'

    // 基础信息
    this.baseMsg = opts.baseMsg; //{x,y,w,h,type}
    // 额外信息
    this.extraMsgs = this.getExtra(opts.extraMsgs);

    // 成功之后
    this.successImg = opts.successImg;
    this.successMsg = opts.successMsg; // {w,h,disx,disy};

    // 成功的关等于当前关
    this.nowMsgs = opts.nowMsgs; // [{img, w,h,disx,disy}]

}
LevelO.prototype.getExtra = function (extra) {
    if (extra) {
        var arr = [];
        for (var i = 0, len = extra.length; i < len; i++) {
            var e = extra[i];
            var img = this.opts[e.type + 'Imgs'][e.index];
            var msg = this.opts[e.type + 'Msgs'][e.index];
            arr.push({
                img: img,
                x: e.x,
                y: e.y,
                w: msg.w,
                h: msg.h
            })
        }
        return arr;
    } else {
        return null;
    }
}
LevelO.prototype.draw = function () {
    var baseMsg = this.baseMsg;
    if (this.status == 'start') {
        if (baseMsg.type == 'grey') {
            this.ctx.drawImage(this.opts.greyImg, baseMsg.x, baseMsg.y, baseMsg.w, baseMsg.h);
        }
        if (this.extraMsgs) {
            for(var i = 0, len = this.extraMsgs.length; i < len; i++){
                var msg = this.extraMsgs[i]
                this.ctx.drawImage(msg.img, msg.x, msg.y, msg.w, msg.h)
            }
        }
    } else if (this.status == 'success' || this.status == 'now') {
        var successMsg = this.successMsg;
        if (this.successImg && baseMsg.type == 'grey') {
            this.ctx.drawImage(this.successImg, baseMsg.x + successMsg.disx, baseMsg.y + successMsg.disy, successMsg.w, successMsg.h);
        }
        if (this.status == 'now' && baseMsg.type == 'grey') {
            for (var i = 0, len = this.nowMsgs.length; i < len; i++) {
                var msg = this.nowMsgs[i];
                this.ctx.drawImage(msg.img, baseMsg.x + msg.disx, baseMsg.y + msg.disy, msg.w, msg.h);
            }
        }
    }
}

util.setFontSize(Config)
Game.init(Config);