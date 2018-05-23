
var Touch = function (canvas) {
    var self = this;
    canvas.addEventListener('touchstart', function (event) {
        event.stopPropagation();
        event.preventDefault()
        self.touchStart(event);
    }, { passive: false })
    document.addEventListener('touchmove', function (event) {
        event.preventDefault()
        self.touchMove(event);
    }, { passive: false })
    document.addEventListener('touchend', function (event) {
        self.touchEnd(event);
    })
    document.addEventListener('touchcancel', function (event) {
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
    startTime: 0,
    touchStart: function (event) {
        var event = event || window.event;
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        this.isTouchStart = true;
        Game.trigger('touchstart')
        // console.log('touchstart', this.startX, this.startY)
    },
    touchMove: function (event) {
        if (this.isTouchStart) {
            var event = event || window.event;
            this.moveX = event.touches[0].clientX;
            this.moveY = event.touches[0].clientY;
            this.isTouchMove = true;
        }
        // console.log('touchmove', this.moveX, this.moveY)
    },
    touchEnd: function (event) {
        var event = event || window.event;
        this.endX = event.changedTouches[0].clientX;
        this.endY = event.changedTouches[0].clientY;
        Game.trigger('touchend')
        this.isTouchStart = false;
        this.isTouchMove = false;
    },
    reset: function () {
        this.startX = 0;
        this.startY = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.endX = 0;
        this.endY = 0;
        this.isTouchStart = false;
        this.isTouchMove = false;
    },
    releaseEvent: function (event) {
        // document.removeEventListener('touchstart');
        // document.removeEventListener('touchmove');
        // document.removeEventListener('touchend');
    }
}