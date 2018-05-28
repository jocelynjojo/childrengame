var Grade = {
    /**
     * @param {number} id 游戏wp 的id
     */
    init: function (id) {
        this.el = document.getElementById(id)
        this.addHandler();
        return this;
    },
    /**
     * @param {object} opts 配置信息
     */
    show: function (opts) {
        var playTime = (new Date()).getTime() - opts.st
        var percent = playTime / opts.fullSec;
        var starNum = opts.starNum;
        var className = this.el.className.replace(/\s*js-star\d*/, '');
        if (percent > starNum - 1) {
            this.el.className = className + ' js-star1';
        } else {
            this.el.className = className + ' js-star' + (starNum - Math.floor(percent));
        }
        this.el.className = this.el.className.replace(/\s*js-hide\d*/, '')
    },
    addHandler: function () {
        var self = this;
        this.el.addEventListener('touchstart', function (event) {
            var target = event.target;
            var id = target.id;
            if (target.id == 'js-again') {
                self.hide()
                Game.reset();
                Game.play();
            } else if (target.id == 'js-hanber') {
                console.log('hanber')
            } else if (target.id == 'js-next') {
                console.log('next')
            }
        }, { passive: true })
    },
    hide: function () {
        this.el.className = this.el.className + ' js-hide';
    },
    /**
     * 告诉后台过了这关
     */
    sendMsg: function () {
        var d = JSON.parse(localStorage.getItem('key'));
        var gameid = Number(location.search.replace('?GameID=', ''));
        var data = {
            "UserId": d.PK_ID,
            "GameId": gameid
        }
        Ajax.post({
            url: '/api/Data',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                console.log('success')
            }
        })
    }
}