var starList = {
    init: function(){
        this.addEvent()
    },
    addEvent: function(){
        var r = document.getElementById('js-return');
        r.addEventListener('touchstart', function (event) {
            location.href = 'index.html'
        }, { passive: true });
    }
}
var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100
}
util.setFontSize(Config);
starList.init();