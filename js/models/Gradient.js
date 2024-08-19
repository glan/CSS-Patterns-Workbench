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

        radialCSS : function (adjustments, html) {
            var css = '';
            if (html) {
                if (this.attributes.position != '50% 50%')
                    css += ((css) ? ' ' : '') + this.get('position').split(' ').map(function (pos) { return '<span class="value">' + pos + '</span>' }).join(' ');
                if (this.attributes.direction && this.attributes.direction != '')
                    css += ((css) ? ' ' : '') + this.get('direction');

                css += (css) ? ', ' : '';

                if (this.get('shape')) {
                    css += ((this.get('shape') != 'ellipse') ? '<span class="keyword">' + this.get('shape') + '</span>' : '');
                    css += ((this.get('shape') != 'ellipse') && (this.get('size') != 'farthest-corner')) ? ' ' : '';
                    css += ((this.get('size') != 'farthest-corner') ? '<span class="keyword">' + this.get('size') + '</span>' : '');
                    css += ((this.get('shape') != 'ellipse') || (this.get('size') != 'farthest-corner')) ? ', ' : '';
                } else if (this.get('width') != '' && this.get('height') != '') {
                    css += ((css) ? '' : this.get('position') + ', ') + '<span class="value">' + this.get('width') + '</span> <span class="value">' + this.get('height') + '</span>, ';
                }

                css += this.get('colorStops').toString(adjustments, html);
                return '<span class="keyword">' + ((this.get('repeating')) ? 'repeating-' : '') + this.get('name') + '</span><span class="arguments">(' + css + ')</span>';
            } else {
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
                css += this.get('colorStops').toString(adjustments, html);
                return ((this.get('repeating')) ? 'repeating-' : '') + this.get('name') + '(' + css + ')';
            }
        },

        linearCSS : function (adjustments, html) {
            if (html)
                return '<span class="keyword">' + ((this.get('repeating')) ? 'repeating-' : '') + this.get('name') + '</span><span class="arguments">(' + ((this.get('direction') !='') ? '<span class="value">' + this.get('direction') + '</span>, ' : '') + this.get('colorStops').toString(adjustments, html) + ')</span>';
            else
                return ((this.get('repeating')) ? 'repeating-' : '') + this.get('name') + '(' + ((this.get('direction') !='') ? this.get('direction') + ', ' : '') + this.get('colorStops').toString(adjustments) + ')';
        },

        toString : function (adjustments, html) {
            if (this.get('name') === 'linear-gradient') {
                return this.linearCSS(adjustments, html);
            } else {
                return this.radialCSS(adjustments, html);
            }
        }
    }

    return Backbone.Model.extend(gradient);
});