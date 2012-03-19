/**
 * © Glan Thomas 2012
 */

define('models/GradientRadial', ['models/Length'], function (Length) {
    'use strict';

    function GradientRadial(name, repeating, position, direction, shape, size, colorStops) {
        this.name = name;
        this.position = (position && position !== 'center') ? position : '50% 50%';
        this.width = new Length().parseLength(shape);
        this.height = new Length().parseLength(size);
        this.shape = (shape) ? ((this.width.getValue() !== null) ? '' : shape) : 'ellipse';
        this.size = (size && this.height.getValue() === null) ? size : 'farthest-corner';
        this.direction = (direction) ? direction : '';
        this.colorStops = colorStops;
        this.repeating = repeating;
    }

    GradientRadial.prototype = {
        getPosition : function () {
            var pos_regexp = /((?:-?[0-9]*\.?[0-9]+)(?:%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|0)\s*((?:-?[0-9]*\.?[0-9]+)(?:%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|0)/g,
                position = pos_regexp.exec(this.position);
            return {
                x: new Length().parseLength(position[1]),
                y: new Length().parseLength(position[2])
            };
        },

        toString : function (alpha, prefix) {
            return ((prefix) ? prefix + '-' : '') + ((this.repeating) ? 'repeating-' : '') + this.name + '(' +
            this.position + ((this.direction) ? ' ' + this.direction : '') + ((this.position||this.direction) ? ', ' : '') +
            ((this.shape) ? this.shape : this.width) +  ' ' + 
            ((this.shape) ? this.size : this.height) + ((this.shape||this.size||this.width||this.height) ? ', ' : '') + this.colorStops.toString(alpha) + ')';
        }
    }

    return GradientRadial;
});