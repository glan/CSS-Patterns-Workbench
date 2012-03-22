/**
 * © Glan Thomas 2012
 */

define('views/InputColor', function (Rect) {
    'use strict';

    function InputColor(element) {
        this.element = element;
        this.listener = this.element.addEventListener('input', this);
        this.setValue(element.value);
    }

    InputColor.prototype = {
        setValue : function (value) {
            this.element.value = value;
            this.element.setAttribute('style', 'background: -webkit-linear-gradient(' + this.element.value + ',' + this.element.value + '),' + '-webkit-linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC),-webkit-linear-gradient(45deg, #CCC 25%, #FFF 25%, #FFF 75%, #CCC 75%, #CCC); background-size: 10px 10px; background-position: 0 0, 5px 5px;');
        },
        handleEvent : function (event) {
            this.setValue(event.target.value);
        }
    }

    return InputColor;
})