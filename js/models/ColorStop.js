/**
 * © Glan Thomas 2012
 */

define('models/ColorStop', ['vendor/backbone', 'models/Color', 'models/Length'], function (Backbone, Color, Length) {
    'use strict';

    var ColorStop = {
        toString : function (adjustments) {
            return this.attributes.color.toString(adjustments) + ((this.attributes.length) ? ' ' + this.attributes.length : '');
        }
        //getNormalized()
    }

    return Backbone.Model.extend(ColorStop);
});