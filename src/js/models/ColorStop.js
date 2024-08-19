/**
 * © Glan Thomas 2012-2014
 */
'use strict';

var Backbone = require('backbone'),
    Color = require('./Color'),
    Length = require('./Length');

var colorStop = {
    toString : function (adjustments, html) {
        if (html)
            return '<span class="colorstop '+this.cid+'">' + this.getColor().toString(adjustments, html) + '<span class="value">' + ((this.getLength()) ? ' ' + this.getLength() : '') + '</span></span>';
        else
            return this.getColor().toString(adjustments, html) + ((this.getLength()) ? ' ' + this.getLength() : '');
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
};

module.exports = Backbone.Model.extend(colorStop);
