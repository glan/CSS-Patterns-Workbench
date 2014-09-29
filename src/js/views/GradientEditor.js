/**
 * © Glan Thomas 2012-2014
 */
'use strict';

var $ = require('jquery'),
    ColorStops = require('../models/ColorStops'),
    ColorStop = require('../models/ColorStop'),
    Color = require('../models/Color'),
    Length = require('../models/Length');

var activeColorStopElement = null;

function AddColorStopUIElement(colorStop) {
    var template = document.querySelector('#templates>.colorstop'),
        newStop = template.cloneNode(true);
    newStop.setAttribute('data-id',colorStop.cid);
    newStop.querySelector('input[type=color]').value = colorStop.getColor();
    if (colorStop.getLength()) {
        newStop.querySelector('.stop').value = colorStop.getLength().getValue();
        newStop.querySelector('.unit').value = colorStop.getLength().getUnit();
    }
    document.getElementById('info_layer_stops').appendChild(newStop);
}

function getColorStopSortOrder() {
    var newOrder = [];
    $('#info_layer_stops .colorstop').each(function(e, ee) {
        if (!ee.classList.contains('ui-sortable-helper')) {
            if (!ee.querySelector('.stop')) {
                ee = document.querySelector('#info_layer_stops .ui-sortable-helper');
            }
            newOrder.push(ee.getAttribute('data-id'));
        }
    });
    return newOrder;
}

function GradientEditor() {

    document.getElementById('info_add_colorstop').addEventListener('click', this);

    $("#info_layer_stops").sortable({cursor:'-webkit-grabbing', containment:'document', items: 'li', axis: 'y'});
    $("#info_layer_stops").disableSelection();

    $('#info_layer_stops').bind("sort", this.handleEvent.bind(this));
    $('#info_layer_stops').bind("sortstop", this.handleEvent.bind(this));
    $('#info_layer_stops').bind("sortchange", this.handleEvent.bind(this));

    document.addEventListener('color_input', this);

    document.getElementById('info_layer_stops').addEventListener('input', this);
    document.getElementById('info_layer_stops').addEventListener('change', this);
    document.getElementById('info_layer_stops').addEventListener('click', this);
    document.getElementById('info_layer_stops').addEventListener('mousedown', this);

    //document.getElementById('info_layer_stops').addEventListener('blur', this);
}

var proto = GradientEditor.prototype;

proto.setData = function (colorStops) {
    var ii = 0;
    this.colorStops = colorStops;
    this.colorStops.forEach(function(colorStop) {
        AddColorStopUIElement(colorStop);
    });
    window.colorPicker.updateColors();
    this.updateGraph();
};

proto.handleEvent = function (event) {
    var spawnEvent = document.createEvent('UIEvents'),
        colorStop, element;
    spawnEvent.initUIEvent('gradient_update', true, true, window, 1);
    spawnEvent.dontSave = true;
    if (event.type === 'mousedown') {
        // start sort
        activeColorStopElement = $(event.target).closest('[data-id]');
        return;
    } else if (event.type === 'sort') {
        var height = (parseInt(window.getComputedStyle(document.getElementById('info_gradient_preview')).height)),
            normalizedLengths = this.colorStops.getPositions(height),
            top, bottom = (14 + activeColorStopElement.position().top),
            cid = activeColorStopElement.attr('data-id');

        for(var i=0; i<this.colorStops.length; i++) {
            if (this.colorStops.models[i].cid == cid) {
                top = normalizedLengths[i] * height;
            }
        }
        document.getElementById('pipe-b-' + cid).setAttribute('d', 'M0,'+ top +' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom);
        document.getElementById('pipe-a-' + cid).setAttribute('d', 'M0,'+ top +' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom);
        return;
    } else if (event.type === 'sortstop') {
        spawnEvent.dontSave = false;
    } else if (event.type === 'sortchange') {
        this.colorStops.reorder(getColorStopSortOrder());
    } else if (event.target.id === 'info_add_colorstop') {
        this.colorStops.add({
            color: new Color('transparent'),
            length: null,
            order: this.colorStops.last().attributes.order + 1
        });
        AddColorStopUIElement(this.colorStops.last());
        spawnEvent.dontSave = false;
    } else if (event.type === 'color_input' || event.type === 'input' || event.type === 'change') {
        element = $(event.target).closest('[data-id]')[0];
        if (event.type === 'color_input')
            spawnEvent.dontSave = event.dontSave;
        else {
            spawnEvent.dontSave = false;
        }
        colorStop = this.colorStops.get({ cid: element.getAttribute('data-id') });
        if (colorStop) {
            colorStop.setColor(new Color(element.querySelector('input[type=color]').value));
            if (element.querySelector('.stop').value !== '') {
                colorStop.setLength(new Length({unit:element.querySelector('.unit').value}).parseLength(element.querySelector('.stop').value + element.querySelector('.unit').value));
            } else {
                colorStop.setLength(null);
            }
        }
    } else if (event.target.className === 'remove') {
        element = event.target.parentElement;
        colorStop = this.colorStops.get({ cid: element.getAttribute('data-id') });
        this.colorStops.remove(colorStop);
        element.parentNode.removeChild(element);
        spawnEvent.dontSave = false;
    }
    this.updateGraph();
    if ((event.type !== 'change') || (event.target.className !== 'stop')) {
        document.dispatchEvent(spawnEvent);
    }
    if (event.type !== 'click' || event.target.getAttribute('type') !== 'color') {
        event.stopPropagation();
    }
};

proto.updateGraph = function () {
    var svg = '', ii = 0, height = (parseInt(window.getComputedStyle(document.getElementById('info_gradient_preview')).height)),
        normalizedLengths = this.colorStops.getPositions(height),
        stopCount = this.colorStops.length;
    this.colorStops.forEach(function (colorStop) {
        var top = normalizedLengths[ii] * height,
            bottom = (14 + (ii * height / stopCount)),
            id = colorStop.cid;
        svg += '<path id="pipe-b-'+(id)+'" d="M0,'+ top +
         ' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom +
         '" fill="none" stroke="black" stroke-width="4"></path>';
        svg += '<path id="pipe-a-'+(id)+'" d="M0,'+ top +
         ' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom +
         '" fill="none" stroke="'+((colorStop.getColor().getAlpha() == 0) ? 'white' : colorStop.getColor()) +'" stroke-width="2"></path>';
        ii++;
    });
    document.getElementById('stop-graph').innerHTML = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" version="1.1">' + svg + '</svg>';
    document.getElementById('info_gradient_preview').style.background = PrefixFree.prefixCSS(' linear-gradient(180deg,'+this.colorStops.getNormallizedColorStops(height).toString()+')');
};

module.exports = GradientEditor;
