define('models/Rect',['models/Length'], function (Length) {

    var rect = {
        setLeft : function (left) {
            this.left = left;
        },
        setTop : function (top) {
            this.top = top;
        },
        setWidth : function (width) {
            this.aspect = null;
            this.width = width;
        },
        setHeight : function (height) {
            this.aspect = null;
            this.height = height;
        },
        getLeft : function () {
            return this.left;
        },
        getTop : function () {
            return this.top;
        },
        getWidth : function () {
            return this.width;
        },
        getHeight : function () {
            return this.height;
        },
        getAspect : function () {
            return this.aspect = this.aspect || this.getWidth().getValue() / this.getHeight().getValue();
        }
    };

    function Rect(data) {
        this.setLeft(new Length(''+data.left));
        this.setTop(new Length(''+data.top));
        this.setWidth(new Length(''+data.width));
        this.setHeight(new Length(''+data.height));
    }

    Rect.prototype = rect;

    return Rect;
});