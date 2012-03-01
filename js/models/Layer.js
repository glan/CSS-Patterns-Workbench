define('models/Layer', ['vendor/backbone', 'models/Rect', 'models/Length'], function(Backbone, Rect, Length) {
    "use strict";
    var Layer = {
        getImage : function () {
            return this.attributes.image;
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
                    left : new Length(position[0]),
                    top : new Length(position[1]),
                    width : new Length(size[0]),
                    height : new Length(size[1])
                });
            return rect;
        },
        setRect : function (rect) {
            // [TODO] These should be setters
            this.attributes.position =  rect.getLeft() + ' ' + rect.getTop();
            this.attributes.size = rect.getWidth() + ' ' + rect.getHeight();
        }
    };
    return Backbone.Model.extend(Layer);
})
