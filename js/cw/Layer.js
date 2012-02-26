define('cw/Layer', ['backbone'], function(Backbone) {
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
        }
    };
    return Backbone.Model.extend(Layer);
})
