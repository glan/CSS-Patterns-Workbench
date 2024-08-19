/**
 * © Glan Thomas 2012
 */

define('models/Direction', function () {
    'use strict';

    function Direction(value) {
        if (value === 'left top') {
            value = 'top left';
        } else if (value === 'right top') {
            value = 'right left';
        } else if (value === 'left bottom') {
            value = 'bottom left';
        } else if (value === 'right bottom') {
            value = 'bottom right';
        }

        this.value = (typeof value !== 'undefined') ? value : '';
    }

    Direction.prototype = {
        toString : function () {
            if (this.value === 'deg')
                return '';
            return this.value;
        },
        getValue : function () {
            return parseInt(this.value);
        },
        toJSON : function () {
            return this.toString();
        }
    }

    return Direction;
});