define('models/ColorStops', ['models/ColorStop'], function (ColorStop) {

    function ColorStops() {
        this.colorStops = [];
    }

    ColorStops.prototype = {
        toString : function (alpha) {
            var i = 0, out = '';
            for (i; i<this.colorStops.length; i++) {
                out += ((i!==0) ? ',' : '') + this.colorStops[i].toString(alpha);
            }
            return out;
        },
        add : function (colorStop) {
            this.colorStops.push(colorStop);
            return this;
        }
    }

    return ColorStops;
});