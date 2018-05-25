var loginForm = {
    init: function () {
        this.addEvent()
    },
    addEvent: function () {
        var r = document.getElementById('js-login');
        r.addEventListener('touchstart', function (event) {
            console.log('login')
        }, { passive: true });
    }
}
var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100
}
util.setFontSize(Config);
loginForm.init();