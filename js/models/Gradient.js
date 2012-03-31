/**
 * © Glan Thomas 2012
 */

define('models/Gradient',['vendor/backbone', 'models/Length'], function (Backbone, Length) {
    'use strict';

    var gradient = {
        clone : function () {
            var clone = new this.constructor(this.attributes);
            clone.set({ colorStops : this.get('colorStops').clone() });
            return clone;
        },

        // Radial positioning
        getPosition : function () {
            var pos_regexp = /((?:-?[0-9]*\.?[0-9]+)(?:%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|0)\s*((?:-?[0-9]*\.?[0-9]+)(?:%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|0)/g,
                position = pos_regexp.exec(this.get('position'));
            return {
                x: new Length().parseLength(position[1]),
                y: new Length().parseLength(position[2])
            };
        },

        radialCSS : function (adjustments) {
            var css = '';
            if (this.attributes.position != '50% 50%')
                css += ((css) ? ' ' : '') + this.get('position');
            if (this.attributes.direction)
                css += ((css) ? ' ' : '') + this.get('direction');

            css += (css) ? ', ' : '';

            if (this.get('shape')) {
                css += ((this.get('shape') != 'ellipse') ? this.get('shape') : '');
                css += ((this.get('shape') != 'ellipse') && (this.get('size') != 'farthest-corner')) ? ' ' : '';
                css += ((this.get('size') != 'farthest-corner') ? this.get('size') : '');
                css += ((this.get('shape') != 'ellipse') || (this.get('size') != 'farthest-corner')) ? ', ' : '';
            } else if (this.get('width') != '' && this.get('height') != '') {
                css += ((css) ? '' : this.get('position') + ', ') + this.get('width') + ' ' + this.get('height') + ', ';
            }
            css += this.get('colorStops').toString(adjustments);

            return ((this.get('repeating')) ? 'repeating-' : '') + this.get('name') + '(' + css + ')';
        },

        linearCSS : function (adjustments) {
            return ((this.get('repeating')) ? 'repeating-' : '') + this.get('name') + '(' + this.get('direction') + ', ' + this.get('colorStops').toString(adjustments) + ')';
        },

        toString : function () {
            if (this.get('name') === 'linear-gradient') {
                return this.linearCSS();
            } else {
                return this.radialCSS();
            }
        }
    }

    return Backbone.Model.extend(gradient);
});