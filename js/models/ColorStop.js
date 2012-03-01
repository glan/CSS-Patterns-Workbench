define('models/ColorStop', ['util/regexp', 'models/Color', 'models/Length'], function (regex, Color, Length) {

    var colorStopSelect = RegExp.create('({{color}})\\s*({{length}})?', {
        color: regex.color,
        length: regex.length
    }, 'g');

    function ColorStop(xx) {
        var colorStop = new RegExp(colorStopSelect).exec(xx);
        //colorStops.add(new ColorStop(xx));
        //console.log('' + new ColorStop(colorStop[1], colorStop[2]));
        
        this.color = new Color(colorStop[1]);
        this.length = (typeof colorStop[2] !== 'undefined') ? new Length(colorStop[2]) : null;
    }

    ColorStop.prototype = {
        toString : function () {
            return this.color + ((this.length) ? ' ' + this.length : '');
        }
    }

    return ColorStop;
});