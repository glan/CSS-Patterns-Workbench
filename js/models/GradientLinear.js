/**
 * © Glan Thomas 2012
 */

define('models/GradientLinear', ['vendor/underscore', 'models/Direction', 'models/Gradient'], function (_, Direction, Gradient) {
    'use strict';

    function GradientLinear(name, repeating, direction, colorStops) {
        this.name = name;
        this.direction = direction;

        // Super [TODO] create a Super constructor
        this.colorStops = colorStops;
        this.repeating = repeating;
    }

    var gradientLinear = {
        toString : function (adjustments) {
            return ((this.repeating) ? 'repeating-' : '') + this.name + '(' + this.direction + ', ' + this.colorStops.toString(adjustments) + ')';
        }
    }

    _.extend(GradientLinear.prototype, new Gradient(), gradientLinear);

    return GradientLinear;
});