/**
 * © Glan Thomas 2012
 */

define('models/ColorStops', ['models/ColorStop', 'models/Length'], function (ColorStop, Length) {
    'use strict';

    function ColorStops() {
        this.colorStops = [];
    }

    ColorStops.prototype = {
        toString : function (adjustments) {
            var i = 0, out = '';
            for (i; i<this.colorStops.length; i++) {
                out += ((i!==0) ? ', ' : '') + this.colorStops[i].toString(adjustments);
            }
            return out;
        },
        add : function (colorStop) {
            this.colorStops.push(colorStop);
            return this;
        },
        getColorStops : function () {
            var i, length, stops = [], stop;
            for(i=0;i<this.colorStops.length;i++) {
                stop = new ColorStop();
                stop.color =  this.colorStops[i].color;
                stop.length = this.colorStops[i].length;
                if (stop.length == null) {
                    // [TODO make this work for any number of mid stops
                    stop.length = new Length();
                }
                stops.push(stop);
            }
            return stops;
        },
        getNormallizedColorStops : function (normalLength) {
            var positions = this.getPositions(normalLength);
            var i, length, stops = [], stop;
            console.log(positions);
            for(i=0;i<this.colorStops.length;i++) {
                stop = new ColorStop();
                stop.color =  this.colorStops[i].color;
                stop.length = new Length().parseLength(positions[i] * 100 + '%');
                stops.push(stop);
            }
            return stops;
        },
        getPositions : function (normalLength) {
            var positions = [], pos, ii, i = 0, lockStart = 0, lockEnd, max = 1, scale = 1;
            for(i=0; i<this.colorStops.length; i++) {
                if (this.colorStops[i].length && this.colorStops[i].length.normalize(normalLength) > max)
                    max = this.colorStops[i].length.normalize(normalLength);
            }
            scale = 1 / max;
            console.log(scale);
            for(i=0; i<this.colorStops.length; i++) {
                pos = (this.colorStops[i].length) ? scale * this.colorStops[i].length.normalize(normalLength) : null;

                if (pos === null) {
                    if (i === 0)
                        pos = 0;
                    if (i === this.colorStops.length - 1)
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
        }
    }

    return ColorStops;
});