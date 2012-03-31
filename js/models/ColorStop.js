/**
 * © Glan Thomas 2012
 */

define('models/ColorStop', ['vendor/backbone', 'models/Color', 'models/Length'], function (Backbone, Color, Length) {
    'use strict';

    var colorStop = {
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
        },
        toJSON : function () {
            return {
                'color':this.getColor(),
                'length':this.getLength()
            };
        },
        clone : function () {
            var clone = new this.constructor(this.attributes);
            clone.setColor(new Color(this.get('color').toString()));
            if (this.get('length')) {
                clone.setLength(new Length(this.get('length').toJSON()));
            }
            return clone;
        }
    }

    var ColorStop = Backbone.Model.extend(colorStop);

    return ColorStop;
});