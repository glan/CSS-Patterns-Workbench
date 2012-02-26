define('cw/Layers', ['backbone', 'cw/Layer', 'cw/builder' ,'cw/regexp'], function(Backbone, Layer, builder, regex) {
    "use strict";
    var Layers = Backbone.Collection.extend({
        model: Layer,
        toString : function () {
            var image     = 'background:' + this.first().getImage() + ((this.first().getPosition()) ? ' ' + this.first().getPosition() : ''),
                position  = 'background-position:' + this.first().getPosition(),
                size      = '-webkit-background-size:' + this.first().getSize(),
                composite = '-webkit-background-composite:' + this.first().getComposite();
            this.rest(1).forEach(function (x) {
                image     += ',' + x.getImage() + ((x.getPosition()) ? ' ' + x.getPosition() : '');
                position  += ',' + x.getPosition();
                size      += (x.getSize()) ? ',' + x.getSize() : '';
                composite += ',' + x.getComposite();
            });
            image     += ';\n';
            //position  += ';';
            size      += ';\n';
            composite += ';\n';
            return image + size + composite + 'background-color: ' + this.backgroundColor;
        },
        parseCSS : function (css) {
            try {
                this.backgroundColor = new RegExp(regex.backgroundColor).exec(css)[1];
            } catch (e) {
                throw new Error('Bad background-color');
            }
            this.reset(builder.parseCSS(css));
            console.log(this);
            //this.trigger('update');
        }
        /*toCSS : function () {
            return JSON.stringify(this);
        }*/
    });
    return Layers;
})

