define('cw/Composite', function () {

    function Composite(value) {
        this.value = (typeof value !== 'undefined') ? value : 'source-over';
    }

    Composite.prototype = {
        toString : function () {
            return this.value;
        }
    }

    return Composite;
});