define('cw/builder', ['cw/regexp', 'cw/GradientLinear', 'cw/GradientRadial','cw/ColorStops', 'cw/ColorStop','cw/Direction', 'cw/Composite'], function(regex, GradientLinear, GradientRadial, ColorStops, ColorStop, Direction, Composite) {
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
                throw new Error('Bad background-size');
            }
            positions = (cssString.match(regex.backgroundPosition)) ? cssString.match(regex.backgroundPosition)[0].match(regex.position) : null;

            images.forEach(function (x) {
                //console.log(x);
                var colorStops = new ColorStops(),
                    gradient = new RegExp(regex.gradient).exec(x);
                    
                sizeOk = (sizes[i]) ? sizes[i] : sizeOk;

                if (gradient[1] === 'repeating-linear-gradient' || gradient[1] === 'linear-gradient') {

                    gradient[3].match(regex.colorStop).forEach(function (xx) {
                        //console.log(xx);
                        //var colorStop = new RegExp(regex.colorStop).exec(xx);
                        colorStops.add(new ColorStop(xx));
                        //console.log('' + new ColorStop(colorStop[1], colorStop[2]));
                        //colorStop = regex.colorStop.exec(xx);
                        //console.log("'" + xx + "' --> " + colorStop);
                        //console.log('color: ' + colorStop[1]);
                        //if (colorStop[2])
                        //   console.log('length: ' + colorStop[2]);
                    });

                    layers.push({
                        image : new GradientLinear(gradient[1], new Direction(gradient[2]), colorStops),
                        size : sizeOk,
                        position : (positions && positions[i]) ? positions[i] : ((gradient[4]) ? gradient[4] : null),
                        composite : new Composite(),
                        order : i,
                        enabled : true
                    });
                    i++;
                } else if (gradient[5] === 'repeating-radial-gradient' || gradient[5] === 'radial-gradient') {
                    gradient[10].match(regex.colorStop).forEach(function (xx) {
                        colorStops.add(new ColorStop(xx));
                    });

                    layers.push({
                        image : new GradientRadial(gradient[5], gradient[6], gradient[7], gradient[8], gradient[9], colorStops),
                        size : sizeOk,
                        position : (positions && positions[i]) ? positions[i] : ((gradient[11]) ? gradient[11] : null),
                        composite : new Composite(),
                        order : i,
                        enabled : true
                    });
                    i++;
                }
            });

            return layers;
        }
    }
})