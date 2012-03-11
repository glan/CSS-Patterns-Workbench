/**
 * © Glan Thomas 2012
 */

define('models/ColorStops', ['models/ColorStop', 'models/Length'], function (ColorStop, Length) {
    'use strict';

    function ColorStops() {
        this.colorStops = [];
    }

    ColorStops.prototype = {
        toString : function (alpha) {
            var i = 0, out = '';
            for (i; i<this.colorStops.length; i++) {
                out += ((i!==0) ? ',' : '') + this.colorStops[i].toString(alpha);
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
        }
    }

    return ColorStops;
});