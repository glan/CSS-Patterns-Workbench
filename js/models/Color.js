define('models/Color', function () {

    /**
     * @source http://sverri.tumblr.com/post/865857181/javascript-hex-to-rgb-converter
     */
    function hex2rgb(hex) {
        if (hex[0]=="#") hex=hex.substr(1);
            if (hex.length==3) {
                var temp=hex; hex='';
                temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
            for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
        }
        var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
        return {
            red:   parseInt(triplets[0],16),
            green: parseInt(triplets[1],16),
            blue:  parseInt(triplets[2],16)
        }
    }

    var full = /((?:rgb|hsl)a?)\((-?[0-9]*\.?[0-9]+)\,\s*(-?[0-9]*\.?[0-9]+)%?\,\s*(-?[0-9]*\.?[0-9]+)%?(?:\,\s*(-?[0-9]*\.?[0-9]+)?)?\)/,
        hex = /^#(?:([0-9a-fA-F]{1,2})){3}$/;

    function Color(color) {
        var rgb, match;
        this.alpha = 1;
        if (match = color.match(full)) {
            this.type = match[1];
            //console.log(match);
            switch (this.type) {
            case 'rgba' :
                this.alpha = match[5];
            case 'rgb' :
                this.red = match[2];
                this.green = match[3];
                this.blue = match[4];
                break;
            case 'hsla' :
                this.alpha = match[5];
            case 'hsl' :
                this.hue = match[2];
                this.saturation = match[3];
                this.lightness = match[4];
                break;
            }
        } else if (match = color.match(hex)) {
            rgb = hex2rgb(match[0]);
            this.type = 'rgb';
            this.red = rgb.red;
            this.green = rgb.green;
            this.blue = rgb.blue;
        } else if (color === 'transparent') {
            this.type = 'rgba';
            this.red = 0;
            this.green = 0;
            this.blue = 0;
            this.alpha = 0;
         } else if (color === 'white') {
            this.type = 'rgb';
            this.red = 255;
            this.green = 255;
            this.blue = 255;
        } else {
            // [TODO] make a better system for name lookups
            throw new Error('Color \'' + color + '\' not supported');
        }
    }

    Color.prototype = {
        toString : function (alpha) {
            if (typeof alpha == 'undefined')
                alpha = 1;
            var color = '';
            switch (this.type) {
            case 'rgb' :
            case 'rgba' :
                color = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + (alpha * this.alpha) + ')';
                break;
            case 'hsl' :
            case 'hsla' :
                color = 'hsla(' + this.hue + ',' + this.saturation + '%,' + this.lightness + '%,' + (alpha * this.alpha) + ')';
                break;
            }
            return color;
        }
    }

    return Color;
});