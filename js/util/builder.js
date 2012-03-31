/**
 * © Glan Thomas 2012
 */

define('util/builder', ['util/regexp', 'models/Gradient','models/ColorStops', 'models/ColorStop','models/Color','models/Length', 'models/Direction'], function(regex, Gradient, ColorStops, ColorStop, Color, Length, Direction) {
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
                    length : (typeof colorStopData[2] !== 'undefined') ? new Length({unit:'%'}).parseLength(colorStopData[2]) : null,
                    order : i++
                });
            }
        });
        return colorStops;
    }

    return {
        parseCSS : function (cssString) {
            //console.log(regex.backgroundImage);
            //console.log(cssString.match(regex.backgroundImage));
            
            var layers = [],
                images, sizes, positions, repeats, composites;
                
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
            try {
                composites = cssString.match(regex.backgroundComposites)[0].match(/clear|copy|destination-atop|destination-in|destination-out|destination-over|highlight|plus-darker|plus-lighter|source-atop|source-in|source-out|source-over|xor/g);
            } catch (e) {
                composites = [];
            }

            positions = (cssString.match(regex.backgroundPosition)) ? cssString.match(regex.backgroundPosition)[0].match(regex.position) : null;

            images.forEach(function (x) {
                //console.log(x);
                var layer,
                    colorStops = new ColorStops(),
                    gradient = new RegExp(regex.gradient).exec(x),
                    repeating;

                layer = {
                    size : sizes[layers.length % sizes.length],
                    composite : composites[layers.length % composites.length] || 'source-over',
                    order : layers.length,
                    opacity : 1,
                    enabled : true,
                    hue : 0,
                    saturation : 0,
                    lightness : 0,
                    repeat : repeats[layers.length % repeats.length + 1] || 'repeat' // +1 as we don't want to match the 'repeat' in background-repeat
                };

                if (gradient[1] === 'repeating-linear-gradient' || gradient[1] === 'linear-gradient') {
                    layer.image = new Gradient({
                        name : 'linear-gradient',
                        repeating : (gradient[1] === 'repeating-linear-gradient'),
                        direction : new Direction(gradient[2]),
                        colorStops : parseColorStops(gradient[3])
                    });

                    layer.position = (positions) ? positions[layers.length % positions.length] : ((gradient[4]) ? gradient[4] : null);
                    layer.name = 'Linear ' + (layers.length + 1);

                } else if (gradient[5] === 'repeating-radial-gradient' || gradient[5] === 'radial-gradient') {
                    var shape = ''+gradient[8];
                    var size = ''+gradient[9];

                    layer.image = new Gradient({
                        name : 'radial-gradient',
                        repeating : (gradient[5] === 'repeating-radial-gradient'),
                        position : (gradient[6] && gradient[6] !== 'center') ? gradient[6] : '50% 50%',
                        direction : gradient[7],
                        width : new Length().parseLength(gradient[8]),
                        height : new Length().parseLength(gradient[9]),
                        size : size.match(/closest-side|closest-corner|farthest-side|farthest-corner|contain|cover/) || shape.match(/closest-side|closest-corner|farthest-side|farthest-corner|contain|cover/) || 'farthest-corner',
                        shape : shape.match(/ellipse|circle/) || size.match(/ellipse|circle/) || 'ellipse',
                        colorStops : parseColorStops(gradient[10])
                    });

                    layer.position = (positions) ? positions[layers.length % positions.length] : ((gradient[11]) ? gradient[11] : null);
                    layer.name = 'Radial ' + (layers.length + 1);
                }
                layers.push(layer);
            });

            return layers;
        }
    }
})