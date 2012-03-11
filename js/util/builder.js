/**
 * © Glan Thomas 2012
 */

define('util/builder', ['util/regexp', 'models/GradientLinear', 'models/GradientRadial','models/ColorStops', 'models/ColorStop','models/Direction', 'models/Composite'], function(regex, GradientLinear, GradientRadial, ColorStops, ColorStop, Direction, Composite) {
    "use strict";

    return {
        parseCSS : function (cssString) {
            var sizeOk = null;
            //console.log(regex.backgroundImage);
            //console.log(cssString.match(regex.backgroundImage));
            
            var layers = [],
                images, sizes, positions, i = 0;
                
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
            positions = (cssString.match(regex.backgroundPosition)) ? cssString.match(regex.backgroundPosition)[0].match(regex.position) : null;

            images.forEach(function (x) {
                //console.log(x);
                var colorStops = new ColorStops(),
                    gradient = new RegExp(regex.gradient).exec(x),
                    repeating;
                    
                sizeOk = (sizes[i]) ? sizes[i] : sizeOk;

                if (gradient[1] === 'repeating-linear-gradient' || gradient[1] === 'linear-gradient') {

                    gradient[3].match(regex.colorStop).forEach(function (xx) {
                        colorStops.add(new ColorStop(xx));
                    });
                    
                    repeating = (gradient[1] === 'repeating-linear-gradient');

                    layers.push({
                        image : new GradientLinear('linear-gradient', repeating, new Direction(gradient[2]), colorStops),
                        size : sizeOk,
                        position : (positions && positions[i]) ? positions[i] : ((gradient[4]) ? gradient[4] : null),
                        composite : new Composite(),
                        order : i,
                        opacity : 1,
                        enabled : true
                    });
                    i++;
                } else if (gradient[5] === 'repeating-radial-gradient' || gradient[5] === 'radial-gradient') {
                    gradient[10].match(regex.colorStop).forEach(function (xx) {
                        colorStops.add(new ColorStop(xx));
                    });

                    repeating = (gradient[5] === 'repeating-radial-gradient');

                    layers.push({
                        image : new GradientRadial('radial-gradient', repeating, gradient[6], gradient[7], gradient[8], gradient[9], colorStops),
                        size : sizeOk,
                        position : (positions && positions[i]) ? positions[i] : ((gradient[11]) ? gradient[11] : null),
                        composite : new Composite(),
                        order : i,
                        opacity : 1,
                        enabled : true
                    });
                    i++;
                }
            });

            return layers;
        }
    }
})