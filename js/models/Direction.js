define('models/Direction', function () {

    function Direction(value) {
        this.value = (typeof value !== 'undefined') ? value : '90deg';
    }

    Direction.prototype = {
        toString : function () {
            return this.value;
        }
    }

    return Direction;
});