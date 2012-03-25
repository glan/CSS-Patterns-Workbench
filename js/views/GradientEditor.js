/**
 * © Glan Thomas 2012
 */

define('views/GradientEditor', ['models/ColorStops', 'models/ColorStop'], function (ColorStops, ColorStop) {
    'use strict';

    function updateGraph(stops) {
        var svg = '', ii = 0, height = (parseInt(window.getComputedStyle(document.getElementById('info_gradient_preview')).height)),
            normalizedLengths = stops.getPositions(height);
        stops.colorStops.forEach(function(colorStop) {
            //console.log(colorStop.length.getValue());
            var top = normalizedLengths[ii] * height,
                bottom = (14 + (ii * height / stops.colorStops.length)),
                id = typeof colorStop.id !== 'undefined' ? colorStop.id : ii;
            svg += '<path id="pipe-b-'+(id)+'" d="M0,'+ top +
             ' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom + 
             '" fill="none" stroke="black" stroke-width="4"></path>';
            svg += '<path id="pipe-a-'+(id)+'" d="M0,'+ top +
             ' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom + 
             '" fill="none" stroke="'+((colorStop.color.alpha == 0) ? 'white' : colorStop.color) +'" stroke-width="2"></path>';
            ii++;
        });
        document.getElementById('stop-graph').innerHTML = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" version="1.1">' + svg + '</svg>';
    }

    function getColorStopSortOrder() {
        var colorStops = new ColorStops(), colorStop;
        $('#info_layer_stops .colorstop').each(function(e, el) {
            if (!el.classList.contains('ui-sortable-helper')) {
                if (!el.querySelector('.stop')) {
                    el = document.querySelector('#info_layer_stops .ui-sortable-helper');
                }
                colorStop = new ColorStop(el.querySelector('.color').value + ((el.querySelector('.stop').value != '') ? + ' ' + (1 * el.querySelector('.stop').value) + el.querySelector('.unit').value : ''));
                colorStop.id = el.getAttribute('data-id');
                colorStops.add(colorStop);
            }
        });
        return colorStops;
    }

    function GradientEditor() {

        document.getElementById('info_add_colorstop').addEventListener('click', function (event) {
            var template = document.querySelector('#templates>.colorstop');
            var colorStopElement = template.cloneNode(true);
            document.getElementById('info_layer_stops').appendChild(colorStopElement);
            colorStopElement.querySelector('input[type=color]').value = 'transparent';
            colorStopElement.querySelector('input[type=color]').setAttribute('data-id',colorStopElement.querySelector('input[type=color]').setAttribute)
            //new InputColor(colorStopElement.querySelector('input[type=color]'), window.colorPicker);
            window.colorPicker.updateColors();
        });

        $("#info_layer_stops").sortable({cursor:'-webkit-grabbing', containment:'document', items: 'li', axis: 'y'});
        $("#info_layer_stops").disableSelection();

        $('#info-panel').bind("sort", function(event,ui) {
            var el = ui.item[0],
                height = (parseInt(window.getComputedStyle(document.getElementById('info_gradient_preview')).height)),
                stops = getColorStopSortOrder(),
                normalizedLengths = stops.getPositions(height),
                top, bottom = (14 + ui.position.top);
                for(var i=0; i<stops.colorStops.length; i++) {
                    if (stops.colorStops[i].id == el.getAttribute('data-id')) {
                        top = normalizedLengths[i] * height;
                    }
                }
                //console.log(el.getAttribute('data-id'));
            document.getElementById('pipe-b-' + el.getAttribute('data-id')).setAttribute('d', 'M0,'+ top +' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom);
            document.getElementById('pipe-a-' + el.getAttribute('data-id')).setAttribute('d', 'M0,'+ top +' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom);
            //M0,'+ top +' Q15,' + (top) + ' 15,' + (top + (bottom - top)/2) +' T30,'+ bottom +
        });

        $('#info-panel').bind("sortchange", function(event, ui) {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("sortupdate", false, false, window, 1);
            document.getElementById('info-panel').dispatchEvent(spawnEvent);
        });

        document.getElementById('info-panel').addEventListener('sortupdate', this, true);
        // Nasty jQuery events relay hack for catching sortupdate as a real UI event
        $('#info-panel').parent().bind("sortupdate", function() {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("sortupdate", false, false, window, 1);
            document.getElementById('info-panel').dispatchEvent(spawnEvent);
        });

        // Cleans up links if no sort was done
        $('#info-panel').bind("sortstop", function(event, ui) {
            updateGraph(getColorStopSortOrder());
        });

        document.addEventListener('color_input', this);

        document.getElementById('info_layer_stops').addEventListener('input', this);
        document.getElementById('info_layer_stops').addEventListener('change', this);
    }

    var gradientEditor = {
        setData : function (colorStops) {
            var ii = 0;
            colorStops.getColorStops().forEach(function(colorStop) {
                var template = document.querySelector('#templates>.colorstop'), 
                    newStop = template.cloneNode(true);
                newStop.setAttribute('data-id',ii++);
                newStop.querySelector('input[type=color]').value = colorStop.color;
                if (colorStop.length) {
                    newStop.querySelector('.stop').value = colorStop.length.getValue();
                    newStop.querySelector('.unit').value = colorStop.length.getUnit();
                }
                document.getElementById('info_layer_stops').appendChild(newStop);
            });
            window.colorPicker.updateColors();
            updateGraph(colorStops);
            var height = (parseInt(window.getComputedStyle(document.getElementById('info_gradient_preview')).height));

            document.getElementById('info_gradient_preview').setAttribute('style',
                'background: -webkit-linear-gradient(-90deg,'+colorStops.getNormallizedColorStops(height).toString()+');' +
                'background: -moz-linear-gradient(-90deg,'+colorStops.getNormallizedColorStops(height).toString()+');'
            );
        },
        getColorStops : function () {
            return getColorStopSortOrder();
        },
        handleEvent : function (event) {
            var spawnEvent = document.createEvent('UIEvents');
            if ((event.type !== 'change') || (event.target.className !== 'color' && event.target.className !== 'stop')) {
                spawnEvent.initUIEvent('gradient_update', true, true, window, 1);
                spawnEvent.colorStops = getColorStopSortOrder();
                updateGraph(spawnEvent.colorStops);
                var height = (parseInt(window.getComputedStyle(document.getElementById('info_gradient_preview')).height));
                document.getElementById('info_gradient_preview').setAttribute('style',
                    'background: -webkit-linear-gradient(-90deg,'+spawnEvent.colorStops.getNormallizedColorStops(height).toString()+');' +
                    'background: -moz-linear-gradient(-90deg,'+spawnEvent.colorStops.getNormallizedColorStops(height).toString()+');'
                );
                document.dispatchEvent(spawnEvent);
            }
            event.stopPropagation();
        }
    }

    GradientEditor.prototype = gradientEditor;

    return GradientEditor;
})