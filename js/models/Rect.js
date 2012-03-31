/**
 * © Glan Thomas 2012
 */

define('models/Rect',['models/Length'], function (Length) {
    'use strict';

    var rect = {
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
        }
    };

    function Rect(data) {
        this.setLeft(new Length({unit:'px'}).parseLength(data.left));
        this.setTop(new Length({unit:'px'}).parseLength(data.top));
        this.setWidth(new Length({unit:'px'}).parseLength(data.width));
        this.setHeight(new Length({unit:'px'}).parseLength(data.height));
    }

    Rect.prototype = rect;

    return Rect;
});