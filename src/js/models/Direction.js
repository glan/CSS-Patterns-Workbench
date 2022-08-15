/**
 * © Glan Thomas 2012-2014
 */
'use strict';

function Direction(value) {
    if (value === 'to left') {
        value = 'to left';
    } else if (value === 'to right') {
        value = 'to right';
    } else if (value === 'to bottom') {
        value = 'to bottom';
    } else if (value === 'to top') {
        value = 'to top';
    } else if (value === 'to left top') {
        value = 'to top left';
    } else if (value === 'to right top') {
        value = 'to right left';
    } else if (value === 'to left bottom') {
        value = 'to bottom left';
    } else if (value === 'to right bottom') {
        value = 'to bottom right';
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
};

module.exports = Direction;
