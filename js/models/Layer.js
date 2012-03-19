/**
 * © Glan Thomas 2012
 */

define('models/Layer', ['vendor/backbone', 'models/Rect', 'models/Length'], function(Backbone, Rect, Length) {
    "use strict";

    var Layer = {
        getImage : function (prefix) {
            return this.attributes.image.toString(this.attributes.opacity, this.attributes.hue, prefix);
        },
        getSize : function () {
            return (this.attributes.size) ? this.attributes.size : null;
        },
        getPosition : function () {
            return (this.attributes.position) ? this.attributes.position : '';
        },
        getComposite : function () {
            return this.attributes.composite;
        },
        getRect : function () {
            //show size
            // [TODO] Replace with better core typing
            var size = this.getSize().split(' '),
                position = (this.getPosition()) ? this.getPosition().split(' ') : [0,0],
                rect = new Rect({
                    left : new Length('px').parseLength(position[0]),
                    top : new Length('px').parseLength(position[1]),
                    width : new Length('px').parseLength(size[0]),
                    height : new Length('px').parseLength(size[1])
                });
            return rect;
        },
        setRect : function (rect) {
            // [TODO] These should be setters
            this.attributes.position =  rect.getPosition();
            this.attributes.size = rect.getSize();
        },
        setRepeating : function (repeating) {
            this.attributes.image.repeating = repeating;
            this.trigger('update');
        },
        getRepeating : function () {
            return this.attributes.image.repeating;
        }
    };
    return Backbone.Model.extend(Layer);
})
