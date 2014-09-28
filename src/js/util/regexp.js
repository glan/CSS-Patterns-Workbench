/**
 * © Glan Thomas 2012-2014
 */
'use strict';
/**
 * Create complex regexps in an easy to read way
 * @param str {String} Final regex with {{id}} for replacements
 * @param replacements {Object} Object with the replacements
 * @param flags {String} Just like the flags argument in the RegExp constructor
 * @source http://lea.verou.me/2011/03/create-complex-regexps-more-easily/
 */
RegExp.create = function(str, replacements, flags) {
    for(var id in replacements) {
        var replacement = replacements[id],
            idRegExp = RegExp('{{' + id + '}}', 'gi');
        if(replacement.source) {
            replacement = replacement.source.replace(/^\^|\$$/g, '');
        }
        // Don't add extra parentheses if they already exist
        str = str.replace(RegExp('\\(' + idRegExp.source + '\\)', 'gi'), '(' + replacement + ')');
        str = str.replace(idRegExp, '(?:' + replacement + ')');
    }

    return RegExp(str, flags);
};

// Sanitization:
//'spaces':         /\s*(:|;|\{|,)\s*/,
//'extra_spaces':   /\s+/,
//'trailing_sc':    /;\s*(\})/,
//'comments':       /\/\*.*?\*\//,

var regex = {};

regex.number = /^-?[0-9]*\.?[0-9]+$/;
regex.keyword = /^(?:top\s+|bottom\s+)?(?:right|left)|(?:right\s+|left\s+)?(?:top|bottom)$/;

regex.color = RegExp.create('(?:{{keyword}}|{{func}}|{{hex}})', {
    keyword: /^(?:red|tan|grey|gray|lime|navy|blue|teal|aqua|cyan|gold|peru|pink|plum|snow|[a-z]{5,20})$/,
    func: RegExp.create('^(?:rgb|hsl)a?\\((?:\\s*{{number}}%?\\s*,?\\s*){3,4}\\)$', {
        number: regex.number
    }),
    hex: /^#(?:[0-9a-fA-F]{1,2}){3}$/
});

regex.length = RegExp.create('{{number}}{{unit}}|0', {
    number: regex.number,
    unit: /%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh/
});

regex.direction = RegExp.create('^(?:{{keyword}}|{{number}}deg|0)$', {
    keyword: regex.keyword,
    number: regex.number
});

regex.size = RegExp.create('({{length}})\\s*({{length}})?', {
    length: regex.length
}, 'g');

regex.position = RegExp.create('(?:{{keyword}}|{{length}}\\s*{{length}})', {
    keyword: regex.keyword,
    length: regex.length
}, 'g');

regex.colorStop = RegExp.create('(?:{{color}})\\s*(?:{{length}})?', {
    color: regex.color,
    length: regex.length
}, 'g');

//var regex_linearGradient = RegExp.create('-webkit-repeating-linear-gradient\\(\\s*(?:({{direction}})\\s*,)?\\s*({{colorstop}}\\s*(?:,\\s*{{colorstop}}\\s*)+)\\)', {

regex.linearGradient = RegExp.create('(?:-webkit-)?({{linearGradient}})\\(\\s*(?:({{direction}})\\s*,)?\\s*({{colorstop}}\\s*(?:,\\s*{{colorstop}}\\s*)+)\\)\\s*({{position}})?', {
    direction: regex.direction,
    colorStop: regex.colorStop,
    position : regex.position,
    linearGradient : /repeating-linear-gradient|linear-gradient/
}, 'g');

regex.radialGradient = RegExp.create('(?:-webkit-)?({{radialGradient}})\\(\\s*(?:({{position}})?\\s*({{direction}})?\\s*,)?\\s*(?:({{shape}}|{{size}}|{{length}})?\\s*({{shape}}|{{size}}|{{length}})?\\s*,)?\\s*({{colorstop}}\\s*(?:,\\s*{{colorstop}}\\s*)+)\\)\\s*({{position}})?', {
    direction: regex.direction,
    colorStop: regex.colorStop,
    position : regex.position,
    length : regex.length,
    size : /closest-side|closest-corner|farthest-side|farthest-corner|contain|cover/,
    shape: /ellipse|circle/,
    radialGradient : /repeating-radial-gradient|radial-gradient/
}, 'g');

regex.gradient = RegExp.create('{{linearGradient}}|{{radialGradient}}', {
    linearGradient : regex.linearGradient,
    radialGradient : regex.radialGradient
}, 'g');

regex.backgroundImage = RegExp.create('background(?:-image)?:\\s*{{gradient}}\\s*(?:,\\s*{{gradient}}\\s*)*;', {
    gradient : regex.gradient
}, 'g');

regex.backgroundSize = RegExp.create('background-size:\\s*{{size}}\\s*(?:,\\s*{{size}}\\s*)*', {
    size : regex.size
}, 'g');

regex.backgroundPosition = RegExp.create('background-position:\\s*(?:{{position}})\\s*(?:,\\s*(?:{{position}})\\s*)*;', {
    position : regex.position
}, 'g');

regex.backgroundColor = RegExp.create('background-color:\\s*({{color}})', {
    color : regex.color
}, 'g');

regex.backgroundRepeat = RegExp.create('background-repeat:\\s*(?:{{repeat}})\\s*(?:,\\s*{{repeat}}\\s*)*;', {
    repeat : /repeat|repeat-x|repeat-y|no-repeat/
}, 'g');

regex.backgroundComposites = RegExp.create('background-composite:\\s*(?:{{composite}})\\s*(?:,\\s*{{composite}}\\s*)*;', {
    composite : /clear|copy|destination-atop|destination-in|destination-out|destination-over|highlight|plus-darker|plus-lighter|source-atop|source-in|source-out|source-over|xor/
}, 'g');

module.exports = regex;
