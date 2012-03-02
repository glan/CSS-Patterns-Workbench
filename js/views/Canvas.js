define('views/Canvas', function () {

    var template = '<div class="back" style="width: 800px; height: 600px;"><div id="canvas"></div></div>';

    function Canvas(frame) {
        frame.insertAdjacentHTML('afterbegin', template);
        this.domElement = document.getElementById('canvas');
        // Prevent mouse down events propergating up to the document level.
        document.getElementById('canvas').addEventListener('mousedown', function (event) {
             event.stopPropagation();
        });
        
        frame.onselectstart = function () { return false; };

    }

    var canvas = {
        render : function (css) {
            this.domElement.setAttribute('style',css);
        },
        getDomElement : function () {
            return this.domElement;
        },
        setWidth : function (w) {
            this.domElement.parentNode.style.width = w + 'px';
        },
        setHeight : function (h) {
            this.domElement.parentNode.style.height = h + 'px';
        }
    }

    Canvas.prototype = canvas;
    return Canvas;
});