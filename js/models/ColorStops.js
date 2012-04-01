/**
 * © Glan Thomas 2012
 */

define('models/ColorStops', ['vendor/backbone', 'models/ColorStop', 'models/Length'], function (Backbone, ColorStop, Length) {
    'use strict';

    var ColorStops = Backbone.Collection.extend({
        model: ColorStop,
        toString : function (adjustments, html) {
            var i = 0, out = '';
            for (i; i<this.length; i++) {
                out += ((i!==0) ? ', ' : '') + this.models[i].toString(adjustments, html);
            }
            return out;
        },
        getNormallizedColorStops : function (normalLength) {
            var positions = this.getPositions(normalLength);
            var i, length, stops = new ColorStops(), stop;
            for(i=0;i<this.length;i++) {
                stops.add({
                    color : this.models[i].getColor(),
                    length : new Length().parseLength(positions[i] * 100 + '%'),
                    order : this.models[i].attributes.order
                });
            }
            return stops;
        },
        getPositions : function (normalLength) {
            var positions = [], pos, ii, i = 0, lockStart = 0, lockEnd, max = 1, scale = 1;
            for(i=0; i<this.length; i++) {
                if (this.models[i].getLength() && this.models[i].getLength().normalize(normalLength) > max)
                    max = this.models[i].getLength().normalize(normalLength);
            }
            scale = 1 / max;
            for(i=0; i<this.models.length; i++) {
                pos = (this.models[i].getLength()) ? scale * this.models[i].getLength().normalize(normalLength) : null;

                if (pos === null) {
                    if (i === 0)
                        pos = 0;
                    if (i === this.length - 1)
                        pos = 1;
                }

                positions.push(pos);

                if (pos !== null) {
                    lockEnd = positions.length - 1;
                    for(ii = 1; lockStart + ii < lockEnd; ii++) {
                        if (positions[lockStart + ii] === null) {
                            positions[lockStart + ii] = (positions[lockStart] + (ii * (positions[lockEnd] - positions[lockStart]) / (lockEnd - lockStart)));
                        }
                    }
                    lockStart = lockEnd;
                }
            }
            return positions;
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
        clone : function (layer) {
            var clone = new ColorStops();
            this.forEach(function (colorStop) {
                clone.add(colorStop.clone());
            });
            return clone;
        }
    });

    return ColorStops;
});