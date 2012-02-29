define('cw/Layers', ['backbone', 'underscore', 'cw/Layer', 'cw/builder' ,'cw/regexp'], function(Backbone, _, Layer, builder, regex) {
    "use strict";
    var Layers = Backbone.Collection.extend({
        model: Layer,
        toString : function () {
            var image ='',    //=  this.first().getImage() + ((this.first().getPosition()) ? ' ' + this.first().getPosition() : ''),
                position ='',  //=  this.first().getPosition(),
                size = '',     //=  ((this.first().getSize()) ? this.first().getSize() : ''),
                composite ='',//=  this.first().getComposite();
                bgColor = '';
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
            if (composite !=='')
                composite = '-webkit-background-composite: ' + composite + ';\n';
            if (this.backgroundColor)
                bgColor = 'background-color: ' + this.backgroundColor + ';\n';
            return image + size + composite + bgColor;
        },
        parseCSS : function (css) {
            try {
                this.backgroundColor = new RegExp(regex.backgroundColor).exec(css)[1];
            } catch (e) {
                this.backgroundColor = 'transparent';
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
        },
        getGridData : function () {
            var grid = [];
            this.forEach(function (layer) {
                var pos = layer.getPosition(),
                    size = layer.getSize(),
                    data = {};
                if (pos) {
                    pos = pos.split(' ');
                    data.x = pos[0];
                    data.y = pos[1];
                }
                if (size) {
                    size = size.split(' ');
                    data.w = size[0];
                    data.h = size[1];
                }
                grid.push(data);
            });
            return grid;
        }
        /*toCSS : function () {
            return JSON.stringify(this);
        }*/
    });
    return Layers;
})

