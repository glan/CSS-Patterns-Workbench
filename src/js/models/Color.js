/**
 * © Glan Thomas 2012-2014
 */
'use strict';

var goog = require('../vendor/goog/color');

/**
 * @source http://sverri.tumblr.com/post/865857181/javascript-hex-to-rgb-converter
 */
function hex2rgb(hex) {
    if (hex[0] == "#") hex = hex.substr(1);
    if (hex.length == 3) {
        var temp = hex;
        hex = '';
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
        for (var i = 0; i < 3; i++) hex += temp[i] + temp[i];
    }
    var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(
        1);
    return {
        red: parseInt(triplets[0], 16),
        green: parseInt(triplets[1], 16),
        blue: parseInt(triplets[2], 16)
    }
}
var names = {
    'aliceblue': 'F0F8FF',
    'antiquewhite': 'FAEBD7',
    'aqua': '00FFFF',
    'aquamarine': '7FFFD4',
    'azure': 'F0FFFF',
    'beige': 'F5F5DC',
    'bisque': 'FFE4C4',
    'black': '000000',
    'blanchedalmond': 'FFEBCD',
    'blue': '0000FF',
    'blueviolet': '8A2BE2',
    'brown': 'A52A2A',
    'burlywood': 'DEB887',
    'cadetblue': '5F9EA0',
    'chartreuse': '7FFF00',
    'chocolate': 'D2691E',
    'coral': 'FF7F50',
    'cornflowerblue': '6495ED',
    'cornsilk': 'FFF8DC',
    'crimson': 'DC143C',
    'cyan': '00FFFF',
    'darkblue': '00008B',
    'darkcyan': '008B8B',
    'darkgoldenrod': 'B8860B',
    'darkgray': 'A9A9A9',
    'darkgreen': '006400',
    'darkgrey': 'A9A9A9',
    'darkkhaki': 'BDB76B',
    'darkmagenta': '8B008B',
    'darkolivegreen': '556B2F',
    'darkorange': 'FF8C00',
    'darkorchid': '9932CC',
    'darkred': '8B0000',
    'darksalmon': 'E9967A',
    'darkseagreen': '8FBC8F',
    'darkslateblue': '483D8B',
    'darkslategray': '2F4F4F',
    'darkslategrey': '2F4F4F',
    'darkturquoise': '00CED1',
    'darkviolet': '9400D3',
    'deeppink': 'FF1493',
    'deepskyblue': '00BFFF',
    'dimgray': '696969',
    'dimgrey': '696969',
    'dodgerblue': '1E90FF',
    'firebrick': 'B22222',
    'floralwhite': 'FFFAF0',
    'forestgreen': '228B22',
    'fuchsia': 'FF00FF',
    'gainsboro': 'DCDCDC',
    'ghostwhite': 'F8F8FF',
    'gold': 'FFD700',
    'goldenrod': 'DAA520',
    'gray': '808080',
    'green': '008000',
    'greenyellow': 'ADFF2F',
    'grey': '808080',
    'honeydew': 'F0FFF0',
    'hotpink': 'FF69B4',
    'indianred': 'CD5C5C',
    'indigo': '4B0082',
    'ivory': 'FFFFF0',
    'khaki': 'F0E68C',
    'lavender': 'E6E6FA',
    'lavenderblush': 'FFF0F5',
    'lawngreen': '7CFC00',
    'lemonchiffon': 'FFFACD',
    'lightblue': 'ADD8E6',
    'lightcoral': 'F08080',
    'lightcyan': 'E0FFFF',
    'lightgoldenrodyellow': 'FAFAD2',
    'lightgray': 'D3D3D3',
    'lightgreen': '90EE90',
    'lightgrey': 'D3D3D3',
    'lightpink': 'FFB6C1',
    'lightsalmon': 'FFA07A',
    'lightseagreen': '20B2AA',
    'lightskyblue': '87CEFA',
    'lightslategray': '778899',
    'lightslategrey': '778899',
    'lightsteelblue': 'B0C4DE',
    'lightyellow': 'FFFFE0',
    'lime': '00FF00',
    'limegreen': '32CD32',
    'linen': 'FAF0E6',
    'magenta': 'FF00FF',
    'maroon': '800000',
    'mediumaquamarine': '66CDAA',
    'mediumblue': '0000CD',
    'mediumorchid': 'BA55D3',
    'mediumpurple': '9370DB',
    'mediumseagreen': '3CB371',
    'mediumslateblue': '7B68EE',
    'mediumspringgreen': '00FA9A',
    'mediumturquoise': '48D1CC',
    'mediumvioletred': 'C71585',
    'midnightblue': '191970',
    'mintcream': 'F5FFFA',
    'mistyrose': 'FFE4E1',
    'moccasin': 'FFE4B5',
    'navajowhite': 'FFDEAD',
    'navy': '000080',
    'oldlace': 'FDF5E6',
    'olive': '808000',
    'olivedrab': '6B8E23',
    'orange': 'FFA500',
    'orangered': 'FF4500',
    'orchid': 'DA70D6',
    'palegoldenrod': 'EEE8AA',
    'palegreen': '98FB98',
    'paleturquoise': 'AFEEEE',
    'palevioletred': 'DB7093',
    'papayawhip': 'FFEFD5',
    'peachpuff': 'FFDAB9',
    'peru': 'CD853F',
    'pink': 'FFC0CB',
    'plum': 'DDA0DD',
    'powderblue': 'B0E0E6',
    'purple': '800080',
    'red': 'FF0000',
    'rosybrown': 'BC8F8F',
    'royalblue': '4169E1',
    'saddlebrown': '8B4513',
    'salmon': 'FA8072',
    'sandybrown': 'F4A460',
    'seagreen': '2E8B57',
    'seashell': 'FFF5EE',
    'sienna': 'A0522D',
    'silver': 'C0C0C0',
    'skyblue': '87CEEB',
    'slateblue': '6A5ACD',
    'slategray': '708090',
    'slategrey': '708090',
    'snow': 'FFFAFA',
    'springgreen': '00FF7F',
    'steelblue': '4682B4',
    'tan': 'D2B48C',
    'teal': '008080',
    'thistle': 'D8BFD8',
    'tomato': 'FF6347',
    'turquoise': '40E0D0',
    'violet': 'EE82EE',
    'wheat': 'F5DEB3',
    'white': 'FFFFFF',
    'whitesmoke': 'F5F5F5',
    'yellow': 'FFFF00',
    'yellowgreen': '#9ACD32'
},
    full =
        /((?:rgb|hsl)a?)\((-?[0-9]*\.?[0-9]+)\,\s*(-?[0-9]*\.?[0-9]+)%?\,\s*(-?[0-9]*\.?[0-9]+)%?(?:\,\s*(-?[0-9]*\.?[0-9]+)?)?\)/,
    hex = /^#(?:([0-9a-fA-F]{1,2})){3}$/;

function Color(color) {
    var rgb, match;
    this.alpha = 1;
    if (match = color.match(full)) {
        this.type = match[1];
        //console.log(match);
        switch (this.type) {
        case 'rgba':
            this.alpha = match[5];
        case 'rgb':
            this.red = match[2];
            this.green = match[3];
            this.blue = match[4];
            break;
        case 'hsla':
            this.alpha = match[5];
        case 'hsl':
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
    } else if (names[color]) {
        rgb = hex2rgb(names[color]);
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
    } else {
        throw new Error('Color \'' + color + '\' not supported');
    }
}

var proto = Color.prototype;

proto.toJSON = function () {
    return this.toString();
};

proto.toString = function (adjustments, html) {
    var color = '',
        hue, saturation, lightness;

    adjustments = adjustments || {};
    if (typeof adjustments.opacity == 'undefined') {
        adjustments.opacity = 1;
    }

    if (typeof adjustments.hue !== 'undefined' ||
        typeof adjustments.saturation !== 'undefined' ||
        typeof adjustments.lightness !== 'undefined') {
        this.toHSL();
    }

    adjustments.hue = 1 * adjustments.hue || 0;
    adjustments.saturation = 1 * adjustments.saturation || 0;
    adjustments.lightness = 1 * adjustments.lightness || 0;

    switch (this.type) {
    case 'rgb':
    case 'rgba':
        if (html) {
            color = '<span class="value">' + this.red +
                '</span>,<span class="value">' + this.green +
                '</span>,<span class="value">' + this.blue + '</span>';
            if (adjustments.opacity * this.alpha === 1) {
                color =
                    '<span class="keyword">rgb</span><span class="arguments">(' +
                    color + ')</span>';
            } else {
                color =
                    '<span class="keyword">rgba</span><span class="arguments">(' +
                    color + ',<span class="value">' + (adjustments.opacity *
                        this.alpha) + '</span>)</span>';
            }
        } else {
            color = this.red + ',' + this.green + ',' + this.blue;
            if (adjustments.opacity * this.alpha === 1) {
                color = 'rgb(' + color + ')';
            } else {
                color = 'rgba(' + color + ',' + (adjustments.opacity * this.alpha) +
                    ')';
            }
        }
        break;
    case 'hsl':
    case 'hsla':
        hue = 1 * this.hue + adjustments.hue;

        this.saturation = 1 * this.saturation;
        adjustments.saturation = 1 * adjustments.saturation;
        if (adjustments.saturation > 0) {
            saturation = Math.round(10000 * (this.saturation + ((100 - this.saturation) *
                (adjustments.saturation / 100)))) / 10000;
        } else {
            saturation = Math.round(10000 * (this.saturation * ((100 +
                adjustments.saturation) / 100))) / 10000;
        }

        this.lightness = 1 * this.lightness;
        adjustments.lightness = 1 * adjustments.lightness;
        if (adjustments.lightness > 0) {
            lightness = Math.round(10000 * (this.lightness + ((100 - this.lightness) *
                (adjustments.lightness / 100)))) / 10000;
        } else {
            lightness = Math.round(10000 * (this.lightness * ((100 +
                adjustments.lightness) / 100))) / 10000;
        }

        if (html) {
            color = '<span class="value">' + hue + '</span>,' +
                '<span class="value">' + ((saturation < 0) ? 0 : ((saturation >
                    100) ? 100 : saturation)) + '%</span>,' +
                '<span class="value">' + ((lightness < 0) ? 0 : ((lightness >
                    100) ? 100 : lightness)) + '%</span>'

            if (adjustments.opacity * this.alpha === 1) {
                color =
                    '<span class="keyword">hsl</span><span class="arguments">(' +
                    color + ')</span>';
            } else {
                color =
                    '<span class="keyword">hsla</span><span class="arguments">(' +
                    color + ',<span class="value">' + (adjustments.opacity *
                        this.alpha) + '</span>)</span>';
            }
        } else {
            color = hue + ',' + ((saturation < 0) ? 0 : ((saturation > 100) ?
                100 : saturation)) + '%,' + ((lightness < 0) ? 0 : ((lightness >
                100) ? 100 : lightness)) + '%'

            if (adjustments.opacity * this.alpha === 1) {
                color = 'hsl(' + color + ')';
            } else {
                color = 'hsla(' + color + ',' + (adjustments.opacity * this.alpha) +
                    ')';
            }
        }

        break;
    }
    return color;
};

proto.toHSL = function () {
    var hsl;
    if (this.type !== 'hsl' && this.type !== 'hsla') {
        hsl = goog.color.rgbToHsl(this.red, this.green, this.blue);
        this.hue = hsl[0];
        this.saturation = hsl[1] * 100;
        this.lightness = hsl[2] * 100;
        this.type = 'hsla';
    }
    return this;
};

proto.toRGB = function () {
    var rgb;
    if (this.type !== 'rgb' && this.type !== 'rgba') {
        rgb = goog.color.hslToRgb(this.hue, this.saturation / 100, this.lightness /
            100);
        this.red = rgb[0];
        this.green = rgb[1];
        this.blue = rgb[2];
        this.type = 'rgba';
    }
    return this;
};

proto.getAlpha = function () {
    return this.alpha;
};

proto.setAlpha = function (alpha) {
    this.alpha = alpha;
};

module.exports = Color;
