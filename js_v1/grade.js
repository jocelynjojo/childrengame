function Grade(opts) {
    var opts = this.opts = opts || {}
    this.finishbg = new Finishbg(opts);
    this.again = new Again(opts);
    this.hanber = new Hanber(opts);
    this.next = new Next(opts);
    this.stars3 = [];
    for (var i = 0, len = opts.stars3Msgs.length; i < len; i++) {
        this.stars3[i] = new Star(opts, opts.stars3Msgs[i]);
    }
}
Grade.prototype.draw = function (grade) {
    
    context.fillStyle='rgba(0,0,0,0.5)';
    context.fillRect(0, 0, this.opts.designW, this.opts.designH);
    this.finishbg.draw();
    this.again.draw();
    this.hanber.draw();
    this.next.draw();
    if (grade == 3) {
        for (var i = 0; i < grade; i++) {
            this.stars3[i].draw();
        }
    }
}
Grade.prototype.clearAll = function(){
    this.finishbg = null;
    this.again = null;
    this.hanber = null;
    this.next = null;
    this.stars3 = [];
}
Grade.prototype.isInAgain = function(x,y){
    return this.again.isInArea(x,y);
}
Grade.prototype.isInHanber = function(x,y){
    return this.hanber.isInArea(x,y);
}
Grade.prototype.isInNext = function(x,y){
    return this.next.isInArea(x,y);
}
function Finishbg(opts) {
    Ele.call(opts);
    this.setMsg(opts.finishbgImg, opts.finishbgMsg)
}
util.inHeritObject(Ele, Finishbg);

function Again(opts) {
    Ele.call(this, opts);
    this.setMsg(opts.againImg, opts.againMsg, opts.finishbgMsg);
    this.setImgData();
}
util.inHeritObject(Ele, Again);

function Hanber(opts) {
    Ele.call(this, opts);
    this.setMsg(opts.hanberImg, opts.hanberMsg, opts.finishbgMsg);
    this.setImgData();
}
util.inHeritObject(Ele, Hanber);

function Next(opts) {
    Ele.call(this, opts);
    this.setMsg(opts.nextImg, opts.nextMsg, opts.finishbgMsg);
    this.setImgData();
}
util.inHeritObject(Ele, Next);

function Star(opts, starMsg) {
    Ele.call(this, opts);
    this.setMsg(opts.brightImg, starMsg, opts.finishbgMsg);
}
util.inHeritObject(Ele, Star);