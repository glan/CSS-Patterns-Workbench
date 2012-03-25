/**
 * © Glan Thomas 2012
 */

define('models/Gradient', ['vendor/underscore', 'models/ColorStops', 'models/ColorStop'], function (_, ColorStops, ColorStop) {
    'use strict';

    function Gradient() {
    }

    Gradient.prototype = {
        clone : function () {
            var clone = _.clone(this);
            clone.colorStops = new ColorStops();
            this.colorStops.each(function(colorStop) {
                clone.colorStops.add(new ColorStop(colorStop.toJSON()));
            });
            return clone;
        }
    }

    return Gradient;
});