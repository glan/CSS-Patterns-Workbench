/**
 * © Glan Thomas 2012-2014
 */
'use strict';

var Length = require('./Length');

function Rect(data) {
    if (data) {
        this.setLeft(new Length({unit:'px'}).parseLength(data.left));
        this.setTop(new Length({unit:'px'}).parseLength(data.top));
        this.setWidth(new Length({unit:'px'}).parseLength(data.width));
        this.setHeight(new Length({unit:'px'}).parseLength(data.height));
    }
}

Rect.prototype = {
    setLeft : function (left) {
        this.left = left;
    },
    setTop : function (top) {
        this.top = top;
    },
    setWidth : function (width) {
        this.aspect = null;
        this.width = width;
    },
    setHeight : function (height) {
        this.aspect = null;
        this.height = height;
    },
    getLeft : function () {
        return this.left;
    },
    getTop : function () {
        return this.top;
    },
    getWidth : function () {
        return this.width;
    },
    getHeight : function () {
        return this.height;
    },
    getAspect : function () {
        return this.aspect = this.aspect || this.getWidth().getValue() / this.getHeight().getValue();
    },
    getPosition : function () {
        return ((this.getLeft().getValue() === null && this.getTop().getValue() !== null) ? 0 : this.getLeft()) +  ' ' + this.getTop();
    },
    getSize : function () {
        return ((this.getWidth().getValue() === null && this.getHeight().getValue() !== null) ? 0 : this.getWidth()) + ' ' + this.getHeight();
    },
    // Get a rect that is in px
    denormalize : function (w, h) {
        var newRect = new Rect();
        newRect.setWidth(new Length({unit: 'px', value : (this.getWidth().getUnit() === '%') ? (w * this.getWidth().getValue() / 100) : this.getWidth().getValue() }));
        newRect.setHeight(new Length({unit: 'px', value : (this.getHeight().getUnit() === '%') ? (h * this.getHeight().getValue() / 100) : this.getHeight().getValue() }));
        newRect.setLeft(new Length({unit: 'px', value : (this.getLeft().getUnit() === '%') ? (w - newRect.getWidth().getValue()) * this.getLeft().getValue() / 100 : this.getLeft().getValue() }));
        newRect.setTop(new Length({unit: 'px', value : (this.getTop().getUnit() === '%') ? (h - newRect.getHeight().getValue()) * this.getTop().getValue() / 100 : this.getTop().getValue() }));
        return newRect;
    },
    // Get rect in %
    normalize : function (w, h) {
        var newRect = new Rect(), denorm = this.denormalize(w, h);
        newRect.setWidth(new Length({unit: '%', value : (this.getWidth().getUnit() === '%') ? this.getWidth().getValue() : (this.getWidth().getValue() / w) * 100 })) ;
        newRect.setHeight(new Length({unit: '%', value : (this.getHeight().getUnit() === '%') ? this.getHeight().getValue() : (this.getHeight().getValue() / h) * 100 }));
        newRect.setLeft(new Length({unit: '%', value :(this.getLeft().getUnit() === '%') ? this.getLeft().getValue() : this.getLeft().getValue() / (w - denorm.getWidth().getValue()) * 100 }));
        newRect.setTop(new Length({unit: '%', value : (this.getTop().getUnit() === '%') ? this.getTop().getValue() : this.getTop().getValue() / (h - denorm.getHeight().getValue()) * 100 }));
        return newRect;
    },
    toString : function () {
        return [this.left, this.top, this.width, this.height].join(' ');
    }
};

module.exports = Rect;
