/**
 * © Glan Thomas 2012-2014
 */
'use strict';

var $ = require('jquery'),
    Color = require('../models/Color'),
    goog = require('../vendor/goog/color');

var mouseX, mouseY;

function ColorPicker() {
    document.addEventListener('input', this);
    document.addEventListener('click', this);
    document.querySelector('#color-picker heading').addEventListener(
        'mousedown', function (event) {
            mouseY = event.offsetY;
            mouseX = event.offsetX;
            document.addEventListener('mousemove', movePicker);
            document.addEventListener('mouseup', endMovePicker);
        });
    document.getElementById('color-picker').onselectstart = function () {
        return false;
    };
}

function movePicker(event) {
    var el = document.getElementById('color-picker');
    el.style.top = (event.clientY - mouseY) + 'px';
    el.style.left = (event.clientX - mouseX) + 'px';
}

function endMovePicker(event) {
    document.removeEventListener('mousemove', movePicker);
    document.removeEventListener('mouseup', endMovePicker);
}

function updateColorBackground(element) {
    element.setAttribute('style',
        PrefixFree.prefixCSS('background: -webkit-linear-gradient(' + element.value +
            ',' + element.value + '),' +
            '-webkit-linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC),' +
            '-webkit-linear-gradient(45deg, #CCC 25%, #FFF 25%, #FFF 75%, #CCC 75%, #CCC);' +
            'background-size: 10px 10px; background-position: 0 0, 5px 5px;')
    );
}

ColorPicker.prototype = {
    updateColors: function () {
        Array.prototype.slice.call(document.querySelectorAll(
            'input[type=color]')).forEach(function (el) {
            updateColorBackground(el);
        });
    },
    setColor: function (color) {
        var event = {
            target: document.getElementById('picker-text')
        };
        document.getElementById('picker-text').value = color;
        this.handlePickerEvent(event);
    },
    handleEvent: function (event) {
        if (event.target.getAttribute('type') === 'color') {
            this.handleColorEvent(event);
        } else {
            this.handlePickerEvent(event);
        }
    },
    handleColorEvent: function (event) {
        if (event.type === 'click') {
            if (document.body.classList.contains('showpicker')) {
                this.setColor(event.target.value);
            } else {
                this.targetInput = event.target;
                this.targetInput.classList.add('active');
                this.originalColor = this.targetInput.value;
                document.getElementById('picker-text').value = this.originalColor;
                this.setColor(event.target.value);
                document.querySelector('#color-picker .original').style.backgroundColor =
                    this.originalColor;
                document.body.classList.add('showpicker');
                $('#color-picker').fadeIn(100);
            }
        }
    },
    handlePickerEvent: function (event) {
        var spawnEvent = document.createEvent('UIEvents'),
            mode, color;
        spawnEvent.initUIEvent("color_input", true, true, window, 1);
        spawnEvent.dontSave = true;
        switch (event.target.id) {
        case 'picker-button-cancel':
            this.targetInput.value = this.originalColor;
            updateColorBackground(this.targetInput);
            spawnEvent.initUIEvent("color_input", true, true, document.getElementById(
                'info-panel'), 1);
            spawnEvent.dontSave = true;
            this.targetInput.dispatchEvent(spawnEvent);
            this.targetInput.classList.remove('active');
            $('#color-picker').fadeOut(100, function () {
                document.body.classList.remove('showpicker')
            });
            return;
        case 'picker-button-ok':
            this.targetInput.value = this.color;
            updateColorBackground(this.targetInput);
            this.targetInput.classList.remove('active');
            $('#color-picker').fadeOut(100, function () {
                document.body.classList.remove('showpicker')
            });
            spawnEvent.dontSave = false;
            this.targetInput.dispatchEvent(spawnEvent);
            return;
        case 'picker-rgb-red-range':
            document.getElementById('picker-rgb-red').value = event.target.value;
            mode = 'rgb';
            break;
        case 'picker-rgb-red':
            document.getElementById('picker-rgb-red-range').value = event.target
                .value;
            mode = 'rgb';
            break;
        case 'picker-rgb-green-range':
            document.getElementById('picker-rgb-green').value = event.target.value;
            mode = 'rgb';
            break;
        case 'picker-rgb-green':
            document.getElementById('picker-rgb-green-range').value = event.target
                .value;
            mode = 'rgb';
            break;
        case 'picker-rgb-blue-range':
            document.getElementById('picker-rgb-blue').value = event.target.value;
            mode = 'rgb';
            break;
        case 'picker-rgb-blue':
            document.getElementById('picker-rgb-blue-range').value = event.target
                .value;
            mode = 'rgb';
            break;
        case 'picker-hsl-hue-range':
            document.getElementById('picker-hsl-hue').value = event.target.value;
            mode = 'hsl';
            break;
        case 'picker-hsl-hue':
            document.getElementById('picker-hsl-hue-range').value = event.target
                .value;
            mode = 'hsl';
            break;
        case 'picker-hsl-saturation-range':
            document.getElementById('picker-hsl-saturation').value = event.target
                .value;
            mode = 'hsl';
            break;
        case 'picker-hsl-saturation':
            document.getElementById('picker-hsl-saturation-range').value =
                event.target.value;
            mode = 'hsl';
            break;
        case 'picker-hsl-lightness-range':
            document.getElementById('picker-hsl-lightness').value = event.target
                .value;
            mode = 'hsl';
            break;
        case 'picker-hsl-lightness':
            document.getElementById('picker-hsl-lightness-range').value = event
                .target.value;
            mode = 'hsl';
            break;
        case 'picker-alpha-range':
            document.getElementById('picker-alpha').value = event.target.value;
            break;
        case 'picker-alpha':
            document.getElementById('picker-alpha-range').value = event.target.value;
            break;
        case 'picker-text':
            color = new Color(event.target.value);
            mode = 'text';
            break;
        default:
            return;
        }

        switch (mode) {
        case 'text':
            color.toHSL().toRGB();
            document.getElementById('picker-hsl-hue').value = color.hue;
            document.getElementById('picker-hsl-hue-range').value = color.hue;
            document.getElementById('picker-hsl-saturation').value = color.saturation;
            document.getElementById('picker-hsl-saturation-range').value =
                color.saturation;
            document.getElementById('picker-hsl-lightness').value = color.lightness;
            document.getElementById('picker-hsl-lightness-range').value = color
                .lightness;
            document.getElementById('picker-rgb-red').value = color.red;
            document.getElementById('picker-rgb-red-range').value = color.red;
            document.getElementById('picker-rgb-green').value = color.green;
            document.getElementById('picker-rgb-green-range').value = color.green;
            document.getElementById('picker-rgb-blue').value = color.blue;
            document.getElementById('picker-rgb-blue-range').value = color.blue;
            document.getElementById('picker-alpha').value = color.alpha * 100;
            document.getElementById('picker-alpha-range').value = color.alpha *
                100;
            break;
        case 'rgb':
            color = goog.color.rgbToHsl(
                document.getElementById('picker-rgb-red').value,
                document.getElementById('picker-rgb-green').value,
                document.getElementById('picker-rgb-blue').value);
            document.getElementById('picker-hsl-hue').value = color[0];
            document.getElementById('picker-hsl-hue-range').value = color[0];
            document.getElementById('picker-hsl-saturation').value = Math.round(
                color[1] * 10000) / 100;
            document.getElementById('picker-hsl-saturation-range').value =
                color[1] * 100;
            document.getElementById('picker-hsl-lightness').value = Math.round(
                color[2] * 10000) / 100;
            document.getElementById('picker-hsl-lightness-range').value = color[
                2] * 100;
            break;
        case 'hsl':
            color = goog.color.hslToRgb(
                document.getElementById('picker-hsl-hue').value,
                document.getElementById('picker-hsl-saturation').value / 100,
                document.getElementById('picker-hsl-lightness').value / 100);
            document.getElementById('picker-rgb-red').value = color[0];
            document.getElementById('picker-rgb-red-range').value = color[0];
            document.getElementById('picker-rgb-green').value = color[1];
            document.getElementById('picker-rgb-green-range').value = color[1];
            document.getElementById('picker-rgb-blue').value = color[2];
            document.getElementById('picker-rgb-blue-range').value = color[2];
            break;
        }

        document.getElementById('picker-rgb-red-preview').style.background =
            PrefixFree.prefixCSS(' -webkit-linear-gradient(left,' +
                'rgb(0,' + document.getElementById('picker-rgb-green').value +
                ',' + document.getElementById('picker-rgb-blue').value + '),' +
                'rgb(255,' + document.getElementById('picker-rgb-green').value +
                ',' + document.getElementById('picker-rgb-blue').value + '))');

        document.getElementById('picker-rgb-green-preview').style.background =
            PrefixFree.prefixCSS(' -webkit-linear-gradient(left,' +
                'rgb(' + document.getElementById('picker-rgb-red').value +
                ',0,' + document.getElementById('picker-rgb-blue').value + '),' +
                'rgb(' + document.getElementById('picker-rgb-red').value +
                ',255,' + document.getElementById('picker-rgb-blue').value +
                '))');

        document.getElementById('picker-rgb-blue-preview').style.background =
            PrefixFree.prefixCSS(' -webkit-linear-gradient(left,' +
                'rgb(' + document.getElementById('picker-rgb-red').value + ',' +
                document.getElementById('picker-rgb-green').value + ',0),' +
                'rgb(' + document.getElementById('picker-rgb-red').value + ',' +
                document.getElementById('picker-rgb-green').value + ',255))');

        var lightnessStops = '';
        for (var i = 0; i < 11; i++) {
            lightnessStops += ((lightnessStops) ? ',' : '') + 'hsl(' + document
                .getElementById('picker-hsl-hue').value + ',' +
                document.getElementById('picker-hsl-saturation').value + '%,' +
                (i * 10) + '%) ' + (i * 10) + '%'
        }

        var saturationStops = '';
        for (var i = 0; i < 11; i++) {
            saturationStops += ((saturationStops) ? ',' : '') + 'hsl(' +
                document.getElementById('picker-hsl-hue').value + ',' +
                (i * 10) + '%,' +
                document.getElementById('picker-hsl-lightness').value + '%) ' +
                (i * 10) + '%'
        }

        var hueStops = '';
        for (var i = 0; i < 11; i++) {
            hueStops += ((hueStops) ? ',' : '') + 'hsl(' + (i * 36) + ',' +
                document.getElementById('picker-hsl-saturation').value + '%,' +
                document.getElementById('picker-hsl-lightness').value + '%) ' +
                (i * 10) + '%'
        }

        document.getElementById('picker-hsl-lightness-preview').style.background =
            PrefixFree.prefixCSS(' -webkit-linear-gradient(left,' + lightnessStops +
                ')');
        document.getElementById('picker-hsl-saturation-preview').style.background =
            PrefixFree.prefixCSS(' -webkit-linear-gradient(left,' + saturationStops +
                ')');
        document.getElementById('picker-hsl-hue-preview').style.background =
            PrefixFree.prefixCSS(' -webkit-linear-gradient(left,' + hueStops + ')');

        this.color = 'rgba(' + document.getElementById('picker-rgb-red').value +
            ',' +
            document.getElementById('picker-rgb-green').value + ',' +
            document.getElementById('picker-rgb-blue').value + ',' +
            document.getElementById('picker-alpha').value / 100 + ')';

        document.getElementById('picker-alpha-preview').style.backgroundImage =
            PrefixFree.prefixCSS(' -webkit-linear-gradient(left, transparent, ' + this.color +
                '),' +
                '-webkit-linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC),' +
                '-webkit-linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC)'
        );

        document.querySelector('#color-picker .new').style.backgroundColor =
            this.color;

        this.targetInput.value = this.color;
        updateColorBackground(this.targetInput);
        document.getElementById('picker-text').value = this.color;
        this.targetInput.dispatchEvent(spawnEvent);
    }
};

module.exports = ColorPicker;
