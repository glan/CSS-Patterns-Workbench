/**
 * © Glan Thomas 2012
 */

define('models/Layers', ['vendor/backbone', 'vendor/underscore', 'models/Layer', 'util/builder' ,'util/regexp'], function(Backbone, _, Layer, builder, regex) {
    "use strict";

    var Layers = Backbone.Collection.extend({
        model: Layer,
        toString : function (prefixes) {
            prefixes = (prefixes) ? prefixes : [];
            prefixes.push(0);
            var image,    //=  this.first().getImage() + ((this.first().getPosition()) ? ' ' + this.first().getPosition() : ''),
                position,  //=  this.first().getPosition(),
                size,     //=  ((this.first().getSize()) ? this.first().getSize() : ''),
                composite,//=  this.first().getComposite();
                bgColor = '',
                i, css = [];

            for(i=0; i<prefixes.length; i++) {
                image = '';
                position = '';
                size = '';
                composite = '';
                this.forEach(function (x) {
                    if (x.attributes.enabled) {
                        image     += (x.getImage(prefixes[i])) ? ((image !== '') ? ',' : '') + x.getImage(prefixes[i]) + ((x.getPosition()) ? ' ' + x.getPosition() : '') : '';
                        position  += (x.getPosition()) ? ((position !== '') ? ',' : '') + x.getPosition() : '';
                        size      += (x.getSize()) ? ((size !== '') ? ',' : '') + x.getSize() : '';
                        composite += (x.getComposite()) ? ((composite !== '') ? ',' : '') + x.getComposite() : '';
                    }
                });
                image     = 'background:' + image+ ';\n';
                size      = ((prefixes[i]) ? prefixes[i] + '-' : '') + 'background-size:' + size + ';\n';
                if (composite !=='')
                    composite = ((prefixes[i]) ? prefixes[i] + '-' : '') + 'background-composite: ' + composite + ';\n';
                css.push(image + size + composite);
            }
            if (this.backgroundColor)
                bgColor = 'background-color: ' + this.backgroundColor + ';\n';
            css.push(bgColor);
            return css.join('');
        },
        parseCSS : function (css) {
            try {
                this.backgroundColor = new RegExp(regex.backgroundColor).exec(css)[1];
            } catch (e) {
                this.backgroundColor = 'transparent';
            }
            this.reset(builder.parseCSS(css));
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
            return 1 * layer.attributes.order;
        }
        /*toCSS : function () {
            return JSON.stringify(this);
        }*/
    });
    return Layers;
})

