/**
 * © Glan Thomas 2012
 */

define('models/Composite', function () {
    'use strict';

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