//requestAnimation 兼容
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 30);
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
    inHeritObject: function(parentType, childType){
        var prototype = Object.create(parentType.prototype);
        prototype.constructor = childType;
        childType.prototype = prototype;
    }

}



/*
* 获取目标对象实例们中的横坐标和最大横坐标
*/
// 判断实例数组的边界横坐标 getHorizontalBoundary