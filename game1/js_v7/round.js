function Round(opts){
    var opts = opts || {};
    Ele.call(this, opts);
}
util.inHeritObject(Ele, Round);
Round.prototype.draw = function(){
    this.ctx1.drawImage(this.img, this.x, this.y, this.w, this.h)
}
Round.prototype.clear = function(){
    this.ctx1.clearRect(this.x, this.y, this.w, this.h)
}

