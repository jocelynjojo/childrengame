
var Touch = function() {
    var self = this;
    canvas.addEventListener('touchstart', function(event){
        self.touchStart(event);
    })
    canvas.addEventListener('touchmove', function(event){
        self.touchMove(event);
    })
    canvas.addEventListener('touchend', function(event){
        self.touchEnd(event);
    })
    canvas.addEventListener('touchcancel',function(event){
        self.touchEnd(event)
    })
}
Touch.prototype = {
    isTouchStart: false,
    isTouchMove: false,
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    endX: 0,
    endY: 0,
    touchStart: function(event){
        showText('touchStart')
        var event = event || window.event;  
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        this.isTouchStart = true;
        // console.log('touchstart', this.startX, this.startY)
    },
    touchMove: function(event){
        showText('touchMove')
        var event = event || window.event;  
        this.moveX = event.touches[0].clientX;
        this.moveY = event.touches[0].clientY;
        this.isTouchMove = true;
        // console.log('touchmove', this.moveX, this.moveY)
    },
    touchEnd: function(event){
        showText('touchEnd')
        var event = event || window.event;  
        this.endX = event.changedTouches[0].clientX;
        this.endY = event.changedTouches[0].clientY;
        this.isTouchStart = false;
        this.isTouchMove = false;
        // console.log('touchend', this.endX, this.endY)
    },
    releaseEvent: function(event){
        // document.removeEventListener('touchstart');
        // document.removeEventListener('touchmove');
        // document.removeEventListener('touchend');
    }
}