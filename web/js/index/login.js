var loginForm = {
    init: function () {
        this.addEvent()
    },
    addEvent: function () {
        var n = document.getElementById('js-name');
        var p = document.getElementById('js-pass');
        var r = document.getElementById('js-login');
        r.addEventListener('touchstart', function (event) {
            event.preventDefault();
            var data = {
                "UserName": n.value,
                "Password": p.value
            }
            // Ajax.post({
            //     url:''
            // })
            console.log('login', data)
        }, { passive: false });
    }
}
var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100
}
util.setFontSize(Config);
loginForm.init();