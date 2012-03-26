/**
 * © Glan Thomas 2012
 */

define('models/ColorStop', ['vendor/backbone'], function (Backbone) {
    'use strict';

    var ColorStop = {
        toString : function (adjustments) {
            return this.getColor().toString(adjustments) + ((this.getLength()) ? ' ' + this.getLength() : '');
        },
        getLength : function () {
            return this.get('length');
        },
        setLength : function (length) {
            this.set({ 'length' : length });
        },
        getColor : function () {
            return this.get('color');
        },
        setColor : function (color) {
            this.set({ 'color' : color });
        }
    }

    return Backbone.Model.extend(ColorStop);
});