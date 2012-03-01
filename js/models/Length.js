define('models/Length', function () {

    //[TODO] Regexp filter setValue and setUnit input
    var length = {
        regexp : /(-?[0-9]*\.?[0-9]+)(%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|(0)/,
        toString : function () {
            return this.value + ((this.value !== 0 ) ? this.unit : '');
        },
        setValue : function (v) {
            this.value = 1 * v;
        },
        setUnit : function (u) {
            this.unit = u;
        },
        getValue : function () {
            return this.value;
        },
        getUnit : function () {
            return this.unit;
        }
    };

    function Length(str) {
        var result = (typeof str === 'string') ? str.match(this.regexp) : false;
        if (result && result[1] && result[2]) {
            this.value = 1 * result[1];
            this.unit = result[2];
        } else {
            this.value = 0;
            this.unit = 'px';
        }
    }

    Length.prototype = length;

    return Length;
});

/*
    Tests:
    console.log(new Length().toString() === '0');
    console.log(new Length('').toString() === '0');
    console.log(new Length('x').toString() === '0');
    console.log(new Length('2').toString() === '0');
    console.log(new Length('-1').toString() === '0');
    console.log(new Length('0').toString() === '0');
    console.log(new Length(0).toString() === '0');
    console.log(new Length(1).toString() === '0');
    console.log(new Length(-1).toString() === '0');
    console.log(new Length('1.0').toString() === '0');
    console.log(new Length('1.000px').toString() === '1px');
    console.log(new Length('.0001px').toString() === '0.0001px');
    console.log(new Length('0.0001px').toString() === '0.0001px');
    console.log(new Length('-20px').toString() === '-20px');
    console.log(new Length('5.5em').toString() === '5.5em');
    console.log(new Length('10%').toString() === '10%');
    console.log(new Length('1x%').toString() === '0');
*/