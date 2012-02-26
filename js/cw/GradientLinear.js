define('cw/GradientLinear', ['cw/Direction'], function (Direction) {

    function GradientLinear(name, direction, colorStops) {
        this.name = name;
        this.direction = direction;
        this.colorStops = colorStops;
    }

    GradientLinear.prototype = {
        toString : function () {
            return '-webkit-' + this.name + '(' + this.direction + ',' + this.colorStops + ')';
        }
    }

    return GradientLinear;
});