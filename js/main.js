/**
 * © Glan Thomas 2012
 */

require(['jquery', 
'models/Layers',
'models/Color',
'views/Marquee',
'views/LayerAttributesPanel',
'views/Canvas',
'views/LayerList',
'views/ColorPicker',
'vendor/jquery-ui-1.8.14.custom.min', 'vendor/incrementable', 'vendor/prefixfree.min'], function($, Layers, Color, Marquee, LayerAttributesPanel, Canvas, LayerList, ColorPicker) {
    'use strict';
    var layerList = new LayerList(new Layers()),
        canvas = new Canvas(document.getElementById('frame')),
        //grid = new Grid(canvas),
        marquee = new Marquee(canvas),
        infoPanel = new LayerAttributesPanel();

    document.addEventListener('marquee_move', updateView);
    document.addEventListener('marquee_resize', updateView);
    document.addEventListener('infopanel_update', updateView);

    function updateView(event) {
        var selectedLayer
        if (layerList.selectedLayers.length === 1) {
            selectedLayer = layerList.selectedLayers.first();
            if (event.type === 'infopanel_update') {
                selectedLayer.setRect(event.rect);
                marquee.lockAspect = event.aspectLock;
                marquee.setRect(event.rect);

                selectedLayer.set({
                    repeat : event.repeat,
                    opacity : event.opacity,
                    composite : event.composite,
                    hue : selectedLayer.get('hue') + event.hue,
                    saturation : selectedLayer.get('saturation') + event.saturation,
                    lightness : selectedLayer.get('lightness') + event.lightness,
                    aspectLock : event.aspectLock
                });

                var imageData = {
                    repeating : event.repeating,
                    colorStops : event.colorStops,
                }

                if (selectedLayer.get('image').get('name') === 'linear-gradient') {
                    imageData.direction = event.image.direction;
                } else {
                    imageData.position = event.image.position.x + ' ' + event.image.position.y;
                    imageData.shape = event.image.shape;
                    imageData.size = event.image.size;
                    imageData.width = event.image.width;
                    imageData.height = event.image.height;
                }
                selectedLayer.get('image').set(imageData);

                // We need to trigger an update on the layer so that the color stop preview in the layerList can update.
                selectedLayer.trigger('update');
            } else if (event.type === 'marquee_move' || event.type === 'marquee_resize') {
                selectedLayer.setRect(event.rect);
                infoPanel.setData(layerList.selectedLayers, marquee.lockAspect);
                selectedLayer.trigger('update');
            }
        } else {
            if (event.type === 'infopanel_update') {
                layerList.selectedLayers.forEach(function (layer) {
                    layer.set({
                        opacity : event.opacity,
                        hue : layer.get('hue') + event.hue,
                        saturation : layer.get('saturation') + event.saturation,
                        lightness : layer.get('lightness') + event.lightness
                    });
                    layer.trigger('update');
                });
                if (layerList.selectedLayers.length > 0) {
                    layerList.selectedLayers.setRect(event.rect);
                    layerList.layers.trigger('update');
                }
                marquee.lockAspect = event.aspectLock;
                marquee.setRect(event.rect);
            } else if (event.type === 'marquee_move' || event.type === 'marquee_resize') {
                layerList.selectedLayers.setRect(event.rect);
                infoPanel.setData(layerList.selectedLayers, marquee.lockAspect);
                layerList.layers.trigger('update');
            }
        }
    }

    layerList.layers.bind('update', function() {
        console.log(JSON.stringify(layerList.layers.toJSON()));
        canvas.render(layerList.layers.toString(true));
        //grid.setData(layerList.layers);
        //if (document.getElementById('update-grid').checked) {
            //grid.showGrid();
        //}
        if (!document.querySelector('#data:focus')) {
            document.getElementById('data').value = layerList.layers;
        }
        document.getElementById('background-color').value = layerList.layers.backgroundColor;
        document.getElementById('size-bytes').innerHTML = layerList.layers.toString(true).length + ' bytes (W3C) / ' + PrefixFree.prefixCSS(layerList.layers.toString(true), true).length + ' bytes (prefixed)';
    });

    document.addEventListener('layerlist_selection', function(event) {
        if (event.layers && event.layers.length > 0) {
            marquee.setRect(event.layers.getRect());
            marquee.lockAspect = event.layers.getAspectLock();
            marquee.showRect();
            infoPanel.show();
            infoPanel.setData(event.layers, marquee.lockAspect);
        } else {
            marquee.hideRect();
            infoPanel.hide();
        }
    });

    document.getElementById('grid-options').addEventListener('change', function (event) {
        grid.setColor(new Color(document.getElementById('grid-color').value));
        grid.snapto = (document.getElementById('snap-to-grid').checked);
        marquee.setHitTest(function (xy) { return grid.hitTest(xy); });
        //if (document.getElementById('show-grid').checked)
            //grid.showGrid();
        //else
            //grid.hideGrid();
    });

    document.addEventListener('color_input', function (event) {
        if (event.target.id === 'background-color') {
            document.getElementById('background-color').style.backgroundColor = document.getElementById('background-color').value;
            layerList.layers.backgroundColor = document.getElementById('background-color').value;
            layerList.layers.trigger('update');
        }
    });

    document.getElementById('canvas-width').addEventListener('input', function (event) {
        canvas.setWidth(this.value);
    });

    document.getElementById('canvas-height').addEventListener('input', function (event) {
        canvas.setHeight(this.value);
    });

    document.getElementById('data').addEventListener('keyup', function (event) {
        if (event.target.value === '') {
            layerList.layers.reset();
        } else {
            layerList.layers.parseCSS(event.target.value);
        }
        document.getElementById('background-color').value = layerList.layers.backgroundColor;
        marquee.hideRect();
        infoPanel.hide();
    });

    // Force blur on data text area
    document.addEventListener('click', function (event) {
        if (event.target.id !== 'data')
            document.getElementById('data').blur();
    });

    layerList.layers.parseCSS(document.getElementById('data').value);

    window.colorPicker = new ColorPicker();
    window.colorPicker.updateColors();

    new Incrementable(document.getElementById('data'));

    canvas.setWidth(800);
    canvas.setHeight(600);

    document.onselectstart = function () { return false; };

    $(document.body).addClass('ready');

});