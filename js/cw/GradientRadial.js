define('cw/GradientRadial', function () {

    function GradientRadial(name, position, direction, shape, size, colorStops) {
        this.name = name;
        this.position = (position) ? position : '';
        this.shape = (shape) ? shape : '';
        this.size = (size) ? size : '';
        this.direction = (direction) ? direction : '';
        this.colorStops = colorStops;
    }

    GradientRadial.prototype = {
        toString : function () {
            return '-webkit-' + this.name + '(' + this.position + ' ' + this.direction + ((this.position||this.direction) ? ',' : '') + this.shape + ' ' + this.size + ((this.shape||this.size) ? ',' : '') + this.colorStops + ')';
        }
    }

    return GradientRadial;
});