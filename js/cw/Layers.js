define('cw/Layers', ['backbone', 'cw/Layer', 'cw/builder' ,'cw/regexp'], function(Backbone, Layer, builder, regex) {
    "use strict";
    var Layers = Backbone.Collection.extend({
        model: Layer,
        toString : function () {
            var image ='',    //=  this.first().getImage() + ((this.first().getPosition()) ? ' ' + this.first().getPosition() : ''),
                position ='',  //=  this.first().getPosition(),
                size = '',     //=  ((this.first().getSize()) ? this.first().getSize() : ''),
                composite ='';//=  this.first().getComposite();
            this.forEach(function (x) {
                if (x.attributes.enabled) {
                    image     += (x.getImage()) ? ((image !== '') ? ',' : '') + x.getImage() + ((x.getPosition()) ? ' ' + x.getPosition() : '') : '';
                    position  += (x.getPosition()) ? ((position !== '') ? ',' : '') + x.getPosition() : '';
                    size      += (x.getSize()) ? ((size !== '') ? ',' : '') + x.getSize() : '';
                    composite += (x.getComposite()) ? ((composite !== '') ? ',' : '') + x.getComposite() : '';
                }
            });
            image     = 'background:' + image+ ';\n';
            position  = 'background-position:' + position + ';\n';
            size      = '-webkit-background-size:' + size + ';\n';
            composite = '-webkit-background-composite: ' + composite + ';\n';
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
        },
        reorder : function (neworder) {
            for(var i in neworder) {
                this.getByCid(neworder[i]).attributes.order = i;
            };
            this.sort({silent: true});
            this.trigger('update');
        },
        comparator : function (layer) {
            return layer.attributes.order;
        }
        /*toCSS : function () {
            return JSON.stringify(this);
        }*/
    });
    return Layers;
})

