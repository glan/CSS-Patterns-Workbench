/**
 * © Glan Thomas 2012-2014
 */
'use strict';

var Backbone = require('backbone'),
    Rect = require('./Rect'),
    Length = require('./Length');

var Layer = {
    getImage : function (html) {
        return this.attributes.image.toString( {
            opacity : this.attributes.opacity,
            hue : this.attributes.hue,
            saturation : this.attributes.saturation,
            lightness : this.attributes.lightness
        }, html);
    },
    getSize : function () {
        return (this.attributes.size) ? this.attributes.size : null;
    },
    getPosition : function (html) {
        if (html) {
            if (this.attributes.position && this.attributes.position != ' ') {
                return (this.attributes.position).split(' ').map(function(pos) {
                    return '<span class="value">' + pos + '</span>';
                }).join(' ');
            } else {
                return '';
            }
        } else {
            return (this.attributes.position) ? this.attributes.position : '';
        }
    },
    getComposite : function () {
        return this.attributes.composite;
    },
    getRepeat : function () {
        return this.attributes.repeat;
    },
    getRect : function () {
        var size, position;
        //show size
        // [TODO] Replace with better core typing
        if (this.rect)
            return this.rect;

        size = this.getSize().split(' ');
        position = (this.getPosition()) ? this.getPosition().split(' ') : [0,0];
        this.rect = new Rect({
            left : new Length({unit:'px'}).parseLength(position[0]),
            top : new Length({unit:'px'}).parseLength(position[1]),
            width : new Length({unit:'px'}).parseLength(size[0]),
            height : new Length({unit:'px'}).parseLength(size[1])
        });
        return this.rect;
    },
    setRect : function (rect) {
        // [TODO] These should be setters
        this.rect = null;
        this.attributes.position =  rect.getPosition();
        this.attributes.size = rect.getSize();
    },
    getRepeating : function () {
        return this.attributes.image.attributes.repeating;
    },
    clone : function () {
        var clone = new this.constructor(this.attributes);
        clone.attributes.image = this.attributes.image.clone();
        clone.attributes.order = 1 * this.attributes.order - 0.01;
        return clone;
    }
};

module.exports = Backbone.Model.extend(Layer);
