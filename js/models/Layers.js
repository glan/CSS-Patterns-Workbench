/**
 * © Glan Thomas 2012
 */

define('models/Layers', ['vendor/backbone', 'vendor/underscore', 'models/Layer', 'models/Rect', 'models/Length', 'models/Color', 'util/builder' ,'util/regexp'], function(Backbone, _, Layer, Rect, Length, Color, builder, regex) {
    "use strict";

    function reduceCyclicCSSValues (list) {
        var i, cycleLength = 1;
        for(i = 1; i < list.length; i++) {
            if ('' + list[i].value !== '' + list[i%cycleLength].value) {
                cycleLength = i+1;
            }
        }
        for(i = 1; i < list.length; i++) {
            list[i%cycleLength].ids.push(list[i].ids.pop());
        }
        return list.slice(0,cycleLength);
    }

    var Layers = Backbone.Collection.extend({
        model: Layer,
        toString : function (compress, html) {
            var i, string, css = [], sizeList = [], compositeList = [], repeatList = [], imageList = [];

            this.forEach(function (x) {
                if (x.attributes.enabled) {
                    sizeList.push({ids: [x.cid], value: x.getSize(html)});
                    compositeList.push({ids: [x.cid], value: x.getComposite(html)});
                    repeatList.push({ids: [x.cid], value: x.getRepeat(html)});
                    if (html) {
                        imageList.push('<span title="' + x.get('name') + '" class="layer ' + x.cid + '">' + x.getImage(html) + ((x.getPosition(html)) ? ' ' + x.getPosition(html) : '') + '</span>');
                    } else {
                        imageList.push(x.getImage(html) + ((x.getPosition(html)) ? ' ' + x.getPosition(html) : ''));
                    }
                }
            });

            sizeList = reduceCyclicCSSValues(sizeList);
            compositeList = reduceCyclicCSSValues(compositeList);
            repeatList = reduceCyclicCSSValues(repeatList);

            if (imageList.length > 0) {
                string = '';
                if (html) {
                    string = '<pre>' +
                    '<span class="property">background</span>' +
                    ':<span class="arguments">' +
                     imageList.join(',\n           ') +
                     '</span>;</pre>';
                } else {
                    string = 'background: ' + imageList.join(',\n') + ';';
                }

                css.push(string);
            }
            if (sizeList.length > 0) {
                string = '';
                if (html) {
                    string = '<pre>' +
                    '<span class="property">background-size</span>' +
                    ':<span class="arguments">';
                    string += sizeList.map(function (size) { 
                        return '<span class="layer ' + size.ids.join(' ') + '">' + size.value.split(' ').map(function (s) { return '<span class="value">'+s+'</span>'; }).join(' ') + '</span>';
                    }).join(', ');
                    string += '</span>;</pre>';
                } else {
                    sizeList = sizeList.map(function (size) { return size.value });
                    string = 'background-size: ' + sizeList.join(', ') + ';\n';
                }
                css.push(string);
            }
            if (repeatList.length > 0 && !(repeatList.length == 1 && repeatList[0].value == 'repeat')) {
                string = '';
                if (html) {
                    string = '<pre>' +
                    '<span class="property">background-repeat</span>' +
                    ':<span class="arguments">';
                    string += repeatList.map(function (repeat) { 
                        return '<span class="keyword layer ' + repeat.ids.join(' ') + '">' + repeat.value + '</span>';
                    }).join(', ');
                    string += '</span>;</pre>';
                } else {
                    repeatList = repeatList.map(function (repeat) { return repeat.value });
                    string = 'background-repeat: ' + repeatList.join(', ') + ';\n';
                }
                css.push(string);
            }
            if (compositeList.length > 0 && !(compositeList.length == 1 && compositeList[0].value == 'source-over')) {
                string = '';
                if (html) {
                    string = '<pre>' +
                    '<span class="property">background-composite</span>' +
                    ':<span class="arguments">';
                    string += compositeList.map(function (composite) { 
                        return '<span class="keyword layer ' + composite.ids.join(' ') + '">' + composite.value + '</span>';
                    }).join(', ');
                    string += '</span>;</pre>';
                } else {
                    compositeList = compositeList.map(function (composite) { return composite.value });
                    string = 'background-composite: ' + compositeList.join(', ') + ';\n';
                }
                css.push(string);
            }
            if (this.backgroundColor) {
                if (html) {
                    css.push('<pre><span class="property">background-color</span>: <span class="arguments">' + new Color(this.backgroundColor).toString([], true) + '</span>;</pre>');
                } else {
                    css.push('background-color: ' + this.backgroundColor + ';');
                }
            }

            if (compress)
                return css.join('').replace(/(,|\:|\))\s*/g, "$1");
            else
                return css.join('\n');
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
        parseJSON : function (json) {
            this.reset(json);
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
                left: new Length({unit:'px'}).parseLength(left + this.first().getRect().left.getUnit()),
                top: new Length({unit:'px'}).parseLength(top + this.first().getRect().top.getUnit()),
                width: new Length({unit:'px'}).parseLength((w - left) + this.first().getRect().width.getUnit()),
                height: new Length({unit:'px'}).parseLength((h - top) + this.first().getRect().height.getUnit())
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
        },
        getAspectLock : function () {
            var aspectLock = false;
            this.forEach(function (layer) {
                aspectLock = aspectLock || layer.attributes.aspectLock;
            });
            return aspectLock;
        }
        /*,
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

