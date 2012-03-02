define('models/GradientRadial', function () {

    function GradientRadial(name, repeating, position, direction, shape, size, colorStops) {
        this.name = name;
        this.position = (position) ? position : '';
        this.shape = (shape) ? shape : '';
        this.size = (size) ? size : '';
        this.direction = (direction) ? direction : '';
        this.colorStops = colorStops;
        this.repeating = repeating;
    }

    GradientRadial.prototype = {
        toString : function (alpha) {
            return '-webkit-' + ((this.repeating) ? 'repeating-' : '') + this.name + '(' + this.position + ' ' + this.direction + ((this.position||this.direction) ? ',' : '') + this.shape + ' ' + this.size + ((this.shape||this.size) ? ',' : '') + this.colorStops.toString(alpha) + ')';
        }
    }

    return GradientRadial;
});