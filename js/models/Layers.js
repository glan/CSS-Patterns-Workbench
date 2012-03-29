/**
 * © Glan Thomas 2012
 */

define('models/Layers', ['vendor/backbone', 'vendor/underscore', 'models/Layer', 'models/Rect', 'models/Length', 'util/builder' ,'util/regexp'], function(Backbone, _, Layer, Rect, Length, builder, regex) {
    "use strict";

    function reduceCyclicCSS (list) {
        var i, cycleLength = 1;
        for(i = 1; i < list.length; i++) {
            if ('' + list[i] !== '' + list[i%cycleLength]) {
                cycleLength = i+1;
            }
        }
        return list.slice(0,cycleLength);
    }

    var Layers = Backbone.Collection.extend({
        model: Layer,
        toString : function (compress) {
            var i, css = [], sizeList = [], compositeList = [], repeatList = [], imageList = [];

            this.forEach(function (x) {
                if (x.attributes.enabled) {
                    sizeList.push(x.getSize());
                    compositeList.push(x.getComposite());
                    repeatList.push(x.getRepeat());
                    imageList.push(x.getImage() + ((x.getPosition()) ? ' ' + x.getPosition() : ''));
                }
            });

            sizeList = reduceCyclicCSS(sizeList);
            compositeList = reduceCyclicCSS(compositeList);
            repeatList = reduceCyclicCSS(repeatList);

            if (imageList.length > 0) {
                css.push('background: ' + imageList.join(',\n'));
            }
            if (sizeList.length > 0) {
                css.push('background-size: ' + sizeList.join(', '));
            }
            if (repeatList.length > 0 && !(repeatList.length == 1 && repeatList[0] == 'repeat')) {
                css.push('background-repeat: ' + repeatList.join(', '));
            }
            if (compositeList.length > 0 && !(compositeList.length == 1 && compositeList[0] == 'source-over')) {
                css.push('background-composite: ' + compositeList.join(', '));
            }
            if (this.backgroundColor) {
                css.push('background-color: ' + this.backgroundColor + ';');
            }

            if (compress)
                return css.join(';').replace(/(,|\:|\))\s*/g, "$1");
            else
                return css.join(';\n');
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
        },
        getRect : function () {
            var w = 0, h = 0, top = null, left = null, rect;
            this.forEach(function (layer) {
                var layerRect = layer.getRect();
                if (layerRect.getWidth().getValue() + layerRect.getLeft().getValue() > w) {
                    w = layerRect.getWidth().getValue() + layerRect.getLeft().getValue();
                }
                if (layerRect.getHeight().getValue() + layerRect.getTop().getValue() > h) {
                    h = layerRect.getHeight().getValue() + layerRect.getTop().getValue();
                }
                if (top === null || layerRect.getTop().getValue() < top) {
                    top = layerRect.getTop().getValue();
                }
                if (left === null || layerRect.getLeft().getValue() < left) {
                    left = layerRect.getLeft().getValue();
                }
            });
            rect = new Rect({
                left: new Length('px').parseLength(left + this.first().getRect().left.getUnit()),
                top: new Length('px').parseLength(top + this.first().getRect().top.getUnit()),
                width: new Length('px').parseLength((w - left) + this.first().getRect().width.getUnit()),
                height: new Length('px').parseLength((h - top) + this.first().getRect().height.getUnit())
            });
            return rect;
        },
        setRect : function (rect) {
            var current = this.getRect(),
                scaleX = rect.getWidth().getValue() / current.getWidth().getValue(),
                scaleY = rect.getHeight().getValue() / current.getHeight().getValue(),
                diffTop = (current.getTop().getValue() - rect.getTop().getValue()),
                diffLeft = (current.getLeft().getValue() - rect.getLeft().getValue()),
                diffWidth = (current.getWidth().getValue() - rect.getWidth().getValue()),
                diffHeight = (current.getHeight().getValue() - rect.getHeight().getValue());
            this.forEach(function (layer) {
                var rect = layer.getRect();
                rect.getTop().setValue((rect.getTop().getValue() * scaleY) - diffTop);
                rect.getLeft().setValue((rect.getLeft().getValue() * scaleX) - diffLeft);
                rect.getWidth().setValue((rect.getWidth().getValue() * scaleX));
                rect.getHeight().setValue((rect.getHeight().getValue() * scaleY));
                layer.setRect(rect);
            });
        },
        getOpacity : function () {
            var opacity = 0;
            this.forEach(function (layer) {
                if (layer.attributes.opacity > opacity)
                    opacity = layer.attributes.opacity;
            });
            return opacity;
        }/*,
        adjustHue : function (hue) {
            this.forEach(function (layer) {
                layer.attributes.hue = hue;
            });
        }*/
        /*,
        setOpacity : function (opacity) {
            this.forEach(function (layer) {
                layer.attributes.opacity = opacity;
            });
        }*/
        /*toCSS : function () {
            return JSON.stringify(this);
        }*/
    });
    return Layers;
})

