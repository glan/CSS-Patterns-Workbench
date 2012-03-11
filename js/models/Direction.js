/**
 * © Glan Thomas 2012
 */

define('models/Direction', function () {
    'use strict';

    function Direction(value) {
        this.value = (typeof value !== 'undefined') ? value : '90deg';
    }

    Direction.prototype = {
        toString : function () {
            return this.value;
        },
        getValue : function () {
            return parseInt(this.value);
        }
    }

    return Direction;
});