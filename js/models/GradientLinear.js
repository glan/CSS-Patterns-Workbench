/**
 * © Glan Thomas 2012
 */

define('models/GradientLinear', ['models/Direction'], function (Direction) {
    'use strict';

    function GradientLinear(name, repeating, direction, colorStops) {
        this.name = name;
        this.direction = direction;
        this.colorStops = colorStops;
        this.repeating = repeating;
    }

    GradientLinear.prototype = {
        toString : function (alpha, prefix) {
            return ((prefix) ? prefix + '-' : '') + ((this.repeating) ? 'repeating-' : '') + this.name + '(' + this.direction + ',' + this.colorStops.toString(alpha) + ')';
        }
    }

    return GradientLinear;
});