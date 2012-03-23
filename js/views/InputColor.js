/**
 * © Glan Thomas 2012
 */

define('views/InputColor', function () {
    'use strict';

    function InputColor(element, picker) {
        this.element = element;
        this.picker = picker;
        this.listener = this.element.addEventListener('input', this);
        this.listener = this.element.addEventListener('click', this);
        this.setValue(element.value);
    }

    InputColor.prototype = {
        setValue : function (value) {
            this.element.value = value;
            this.element.setAttribute('style', 'background: -webkit-linear-gradient(' + this.element.value + ',' + this.element.value + '),' + '-webkit-linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC),-webkit-linear-gradient(45deg, #CCC 25%, #FFF 25%, #FFF 75%, #CCC 75%, #CCC); background-size: 10px 10px; background-position: 0 0, 5px 5px;');
        },
        handleEvent : function (event) {
            if (event.type === 'click')
                if (this.picker.isOpen()) {
                    this.picker.setColor(this);
                } else {
                    this.picker.open(this);
                }
            else
                this.setValue(this.element.value);
        }
    }

    return InputColor;
})