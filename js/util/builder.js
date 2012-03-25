/**
 * © Glan Thomas 2012
 */

define('util/builder', ['util/regexp', 'models/GradientLinear', 'models/GradientRadial','models/ColorStops', 'models/ColorStop','models/Color','models/Length', 'models/Direction', 'models/Composite'], function(regex, GradientLinear, GradientRadial, ColorStops, ColorStop, Color, Length, Direction, Composite) {
    "use strict";

    var colorStopSelect = RegExp.create('({{color}})\\s*({{length}})?', {
            color: regex.color,
            length: regex.length
        }, 'g');

    function parseColorStops(gradient) {
        var colorStops = new ColorStops(), i = 0;
        gradient.match(regex.colorStop).forEach(function (xx) {
            var colorStopData = new RegExp(colorStopSelect).exec(xx);
            if (colorStopData[0] !== 'undefined') {
                colorStops.add({
                    color : new Color(colorStopData[1]),
                    length : (typeof colorStopData[2] !== 'undefined') ? new Length('%').parseLength(colorStopData[2]) : null,
                    order : i++
                });
            }
        });
        return colorStops;
    }

    return {
        parseCSS : function (cssString) {
            var sizeOk = null;
            //console.log(regex.backgroundImage);
            //console.log(cssString.match(regex.backgroundImage));
            
            var layers = [],
                images, sizes, positions, repeats, i = 0;
                
            try {
                images = cssString.match(regex.backgroundImage)[0].match(regex.gradient);
            } catch (e) {
                throw new Error('Bad background-image');
            }
            try {
                sizes = cssString.match(regex.backgroundSize)[0].match(regex.size);
            } catch (e) {
                sizes = ['100% 100%'];
            }
            try {
                repeats = cssString.match(regex.backgroundRepeat)[0].match(/repeat-x|repeat-y|no-repeat|repeat/g);
            } catch (e) {
                repeats = [];
            }

            positions = (cssString.match(regex.backgroundPosition)) ? cssString.match(regex.backgroundPosition)[0].match(regex.position) : null;

            images.forEach(function (x) {
                //console.log(x);
                var colorStops = new ColorStops(),
                    gradient = new RegExp(regex.gradient).exec(x),
                    repeating;
                    
                sizeOk = (sizes[i]) ? sizes[i] : sizeOk;

                if (gradient[1] === 'repeating-linear-gradient' || gradient[1] === 'linear-gradient') {

                    colorStops = parseColorStops(gradient[3]);
                    
                    repeating = (gradient[1] === 'repeating-linear-gradient');

                    layers.push({
                        image : new GradientLinear('linear-gradient', repeating, new Direction(gradient[2]), colorStops),
                        size : sizeOk,
                        position : (positions && positions[i]) ? positions[i] : ((gradient[4]) ? gradient[4] : null),
                        composite : new Composite(),
                        order : i,
                        opacity : 1,
                        enabled : true,
                        hue : 0,
                        saturation : 0,
                        lightness : 0,
                        repeat : repeats[i+1] || 'repeat' // +1 as we don't want to match the 'repeat' in background-repeat
                    });
                    i++;
                } else if (gradient[5] === 'repeating-radial-gradient' || gradient[5] === 'radial-gradient') {
                    colorStops = parseColorStops(gradient[10]);

                    repeating = (gradient[5] === 'repeating-radial-gradient');

                    layers.push({
                        image : new GradientRadial('radial-gradient', repeating, gradient[6], gradient[7], gradient[8], gradient[9], colorStops),
                        size : sizeOk,
                        position : (positions && positions[i]) ? positions[i] : ((gradient[11]) ? gradient[11] : null),
                        composite : new Composite(),
                        order : i,
                        opacity : 1,
                        enabled : true,
                        hue : 0,
                        saturation : 0,
                        lightness : 0,
                        repeat : repeats[i+1] || 'repeat'
                    });
                    i++;
                }
            });

            return layers;
        }
    }
})