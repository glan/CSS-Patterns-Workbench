define('cw/Length', function () {

    function Length(value) {
        this.value = value;
    }

    Length.prototype = {
        toString : function () {
            return this.value;
        }
    }

    return Length;
});