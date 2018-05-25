//requestAnimation 兼容
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    }


var util = {
    /**
    * 预加载资源文件
    * @param {Array} resource 资源列表
    * @return {[type]} [description]
    */
    resourceOnload: function (resource, callback) {
        var total = resource.length;
        var finish = 0;
        var images = [];
        for (var i = 0; i < total; i++) {
            images[i] = new Image();
            images[i].src = resource[i]
            // 图片加载完成
            images[i].onload = function () {
                finish++
                if (finish == total) {
                    callback(images);
                }
            }
        }
    },
    /**
     * 继承的最佳实现
     */
    inHeritObject: function (parentType, childType) {
        var prototype = Object.create(parentType.prototype);
        prototype.constructor = childType;
        childType.prototype = prototype;
    },
    /**
     * 克隆对象 模拟assign 方法
     * @param {objects} 对象 以逗号分隔
     */
    assign: function () {
        var obj = {}, o = null;
        for (var i = 0, len = arguments.length; i < len; i++) {
            o = arguments[i];
            for (var key in o) {
                obj[key] = o[key];
            }
        }
        return obj;
    },
    setFontSize: function (opts) {
        var designW = opts.designW;
        var designFS = opts.designFS;
        var html = document.getElementsByTagName('html')[0];
        var clientWidth = html.clientWidth;
        var fs = designFS / designW * clientWidth;
        html.style.fontSize = fs + 'px';
    }
}
var Ajax = {
    get: function (obj) {
        // XMLHttpRequest对象用于在后台与服务器交换数据   
        var xhr = new XMLHttpRequest();
        var url = obj.url;
        var fn = obj.success || function () { };
        var dataType = obj.dataType;
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            // readyState == 4说明请求已完成
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                // 从服务器获得数据 
                var res = xhr.responseText;
                if (dataType && dataType == 'json') {
                    res = JSON.parse(res);
                }
                fn.call(this, res);
            }
        };
        xhr.send();
    },
    // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
    post: function (obj) {
        var xhr = new XMLHttpRequest();
        var url = obj.url;
        var data = obj.data || {};
        var fn = obj.success || function () { };
        var contentType = obj.contentType;
        var dataType = obj.dataType;
        xhr.open("POST", url, true);
        // 添加http头，发送信息至服务器时内容编码类型
        if (contentType) {
            xhr.setRequestHeader("Content-Type", contentType);
        } else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                var res = xhr.responseText;
                if (dataType && dataType == 'json') {
                    res = JSON.parse(res);
                }
                fn.call(this, res);
            }
        };
        xhr.send(data);
    }
}


/*
* 获取目标对象实例们中的横坐标和最大横坐标
*/
// 判断实例数组的边界横坐标 getHorizontalBoundary