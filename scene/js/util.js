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
    * @param {Array|Object} resource 资源列表
    * @return {[type]} [description]
    */
    resourceOnload: function (resource, callback) {

        if (Object.prototype.toString.call(resource) == "[object Array]") {
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
        } else if (Object.prototype.toString.call(resource) == "[object Object]") {
            var images = {}, total = 0, finish = 0;
            for (var key in resource) {
                total++;
            }
            for (var key in resource) {
                images[key] = new Image();
                images[key].src = resource[key]
                // 图片加载完成
                images[key].onload = function () {
                    finish++
                    if (finish == total) {
                        callback(images);
                    }
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

}



/*
* 获取目标对象实例们中的横坐标和最大横坐标
*/
// 判断实例数组的边界横坐标 getHorizontalBoundary