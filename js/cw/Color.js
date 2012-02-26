define('cw/Color', function () {

    function Color(color) {
        this.value = color;
    }

    Color.prototype = {
        toString : function () {
            return this.value;
        }
    }

    return Color;
});