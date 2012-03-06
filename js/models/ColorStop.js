define('models/ColorStop', ['util/regexp', 'models/Color', 'models/Length'], function (regex, Color, Length) {

    var colorStopSelect = RegExp.create('({{color}})\\s*({{length}})?', {
        color: regex.color,
        length: regex.length
    }, 'g');

    function ColorStop(xx) {
        var colorStop = new RegExp(colorStopSelect).exec(xx);
        //colorStops.add(new ColorStop(xx));
        //console.log('' + new ColorStop(colorStop[1], colorStop[2]));
        //console.log(colorStop);
        if (colorStop[0] !== 'undefined') {
            this.color = new Color(colorStop[1]);
            this.length = (typeof colorStop[2] !== 'undefined') ? new Length('%').parseLength(colorStop[2]) : null;
        }
    }

    ColorStop.prototype = {
        toString : function (alpha) {
            return this.color.toString(alpha) + ((this.length) ? ' ' + this.length : '');
        }
    }

    return ColorStop;
});