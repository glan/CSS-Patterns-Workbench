/**
 * © Glan Thomas 2012
 */

define('models/GradientRadial', ['vendor/underscore', 'models/Length', 'models/Gradient'], function (_, Length, Gradient) {
    'use strict';

    function GradientRadial(name, repeating, position, direction, shape, size, colorStops) {
        this.name = name;
        this.position = (position && position !== 'center') ? position : '50% 50%';
        this.width = new Length().parseLength(shape);
        this.height = new Length().parseLength(size);

        size += '';
        shape += '';

        this.size = size.match(/closest-side|closest-corner|farthest-side|farthest-corner|contain|cover/) || shape.match(/closest-side|closest-corner|farthest-side|farthest-corner|contain|cover/) || 'farthest-corner';
        this.shape = shape.match(/ellipse|circle/) || size.match(/ellipse|circle/) || 'ellipse';

        if (this.width.getValue() !== null)
            this.shape = '';

        this.direction = (direction) ? direction : '';

        // Super [TODO] create a Super constructor
        this.colorStops = colorStops;
        this.repeating = repeating;
    }

    var gradientRadial = {
        getPosition : function () {
            var pos_regexp = /((?:-?[0-9]*\.?[0-9]+)(?:%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|0)\s*((?:-?[0-9]*\.?[0-9]+)(?:%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|0)/g,
                position = pos_regexp.exec(this.position);
            return {
                x: new Length().parseLength(position[1]),
                y: new Length().parseLength(position[2])
            };
        },

        toString : function (adjustments) {
            var css = '';
            if (this.position != '50% 50%')
                css += ((css) ? ' ' : '') + this.position;
            if (this.direction)
                css += ((css) ? ' ' : '') + this.direction;

            css += (css) ? ', ' : '';

            if (this.shape) {
                css += ((this.shape != 'ellipse') ? this.shape : '');
                css += ((this.shape != 'ellipse') && (this.size != 'farthest-corner')) ? ' ' : '';
                css += ((this.size != 'farthest-corner') ? this.size : '');
                css += ((this.shape != 'ellipse') || (this.size != 'farthest-corner')) ? ', ' : '';
            } else if (this.width != '' && this.height != '') {
                css += ((css) ? '' : this.position + ', ') + this.width + ' ' + this.height + ', ';
            }

            css += this.colorStops.toString(adjustments);

            return ((this.repeating) ? 'repeating-' : '') + this.name + '(' + css + ')';
        }
    }

    _.extend(GradientRadial.prototype, new Gradient(), gradientRadial);

    return GradientRadial;
});