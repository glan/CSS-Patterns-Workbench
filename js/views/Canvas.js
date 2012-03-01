define('views/Canvas', function () {

    function Canvas() {

    }

    var canvas = {
        render : function (css) {
            document.getElementById('canvas').setAttribute('style',css);
        }
    }

    Canvas.prototype = canvas;
    return Canvas;
});