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
        infoPanel = new LayerAttributesPanel(),
        mouseY;

    function dragtrayMove(event) {
        var height = mouseY - event.clientY;
        height = (height > 9) ? height : 9;
        document.getElementById('dragtray').style.height = (height) + 'px';
        document.getElementById('frame').style.bottom = (height) + 'px';
        resizeWindow();
    }

    function dragtrayEnd(event) {
        document.removeEventListener('mousemove', dragtrayMove);
        document.removeEventListener('mouseup', dragtrayEnd);
    }

    function resizeWindow() {
        var height, top = $('#dragtray').position().top;
        if (top < 23) {
            height = $('#dragtray').height() + (top - 23);
            document.getElementById('dragtray').style.height = (height) + 'px';
            document.getElementById('frame').style.bottom = (height) + 'px';
        }
    }

    document.querySelector('#dragtray .handle').addEventListener('mousedown', function(event) {
        mouseY = event.clientY + parseInt(document.getElementById('dragtray').style.height);
        document.addEventListener('mousemove', dragtrayMove);
        document.addEventListener('mouseup', dragtrayEnd);
    });

    window.addEventListener('resize', resizeWindow);

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
        document.getElementById('data').innerHTML = layerList.layers.toString(false, true);
        updateCodeView();
    }

    function updateCodeView() {
        //if (!document.querySelector('#data:focus')) {
            //document.getElementById('data').innerHTML = layerList.layers.toString(false, true);
        //}
        $('#data .layer').removeClass('selected');
        layerList.selectedLayers.forEach(function (layer) {
            $('#data .layer.' + layer.cid).addClass('selected');
        });
    }

    layerList.layers.bind('update', function() {
        //console.log(JSON.stringify(layerList.layers.toJSON()));
        canvas.render(layerList.layers.toString(true));
        //grid.setData(layerList.layers);
        //if (document.getElementById('update-grid').checked) {
            //grid.showGrid();
        //}
        document.getElementById('data').innerHTML = layerList.layers.toString(false, true);
        updateCodeView();

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
        updateCodeView();
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
        if (event.keyCode <= 13 || (event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode >= 96) {
            if (event.target.textContent === '') {
                layerList.layers.reset();
            } else {
                layerList.layers.parseCSS(document.getElementById('data').textContent);
            }
            document.getElementById('data').innerHTML = layerList.layers.toString(false, true);
            document.getElementById('background-color').value = layerList.layers.backgroundColor;
            marquee.hideRect();
            infoPanel.hide();
        }
    });

    document.getElementById('data').addEventListener('click', function (event) {
        var lay = $(event.target).closest('.layer');
            layerList.selectedLayers = new Layers();
        if (lay.length > 0) {
            lay = lay.attr('class').split(' ');
            $('#layers .layer.selected').removeClass('selected');
            lay.forEach(function (cid) {
                var layer = layerList.layers.getByCid(cid);
                if (layer && !layerList.selectedLayers.getByCid(cid)) {
                    layerList.selectedLayers.add(layer);
                    $(document.querySelector('#layers .layer[data-id='+cid+']')).addClass('selected');
                }
            });
            layerList.dispacheEvent('selection');
        }
    });

    /*document.getElementById('data').addEventListener('blur', function (event) {
        layerList.layers.parseCSS(document.getElementById('data').textContent);
        document.getElementById('background-color').value = layerList.layers.backgroundColor;
    });*/

    // Force blur on data text area
    document.addEventListener('mousedown', function (event) {
        if (!$(event.target).closest('#data').length)
            document.getElementById('data').blur();
    });

    layerList.layers.parseCSS(document.getElementById('data').textContent);
    document.getElementById('data').innerHTML = layerList.layers.toString(false, true);

    window.colorPicker = new ColorPicker();
    window.colorPicker.updateColors();

    //new Incrementable(document.getElementById('data'));

    canvas.setWidth(800);
    canvas.setHeight(600);

    document.getElementById('data').onselectstart = function (event) { event.stopPropagation(); };

    document.onselectstart = function () { return false; };

    $(document.body).addClass('ready');

});