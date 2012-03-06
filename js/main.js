require(['jquery', 
'models/Layers',
'models/Color',
'views/Marquee',
'views/LayerAttributesPanel',
'views/Canvas',
'views/Grid',
'views/LayerList',
'js/vendor/jquery-ui-1.8.14.custom.min.js'], function($, Layers, Color, Marquee, LayerAttributesPanel, Canvas, Grid, LayerList) {
    'use strict';
    var layerList = new LayerList(new Layers()),
        canvas = new Canvas(document.getElementById('frame')),
        grid = new Grid(canvas),
        marquee = new Marquee(canvas),
        infoPanel = new LayerAttributesPanel();

    document.addEventListener('marquee_move', updateView);
    document.addEventListener('marquee_resize', updateView);
    document.addEventListener('infopanel_update', updateView);

    function updateView(event) {
        if (event.type === 'infopanel_update') {
            layerList.selectedLayer.setRect(event.rect);
            marquee.setRect(event.rect);
            layerList.selectedLayer.setRepeating(event.repeating);
            layerList.selectedLayer.attributes.opacity = event.opacity;
            layerList.selectedLayer.attributes.composite = event.composite;
            layerList.selectedLayer.attributes.image.colorStops = event.colorStops;
            layerList.selectedLayer.trigger('update');
        } else if (event.type === 'marquee_move' || event.type === 'marquee_resize') {
            layerList.selectedLayer.setRect(event.rect);
            infoPanel.setData(layerList.selectedLayer);
        }
        layerList.layers.trigger('update');
    }

    layerList.layers.bind('update', function() {
        canvas.render(layerList.layers);
        grid.setData(layerList.layers);
        if (document.getElementById('update-grid').checked) {
            grid.showGrid();
        }
        document.getElementById('data').value = layerList.layers;
        document.getElementById('background-color').value = layerList.layers.backgroundColor;
    });

    document.addEventListener('layerlist_selection', function(event) {
        if (event.layer) {
            marquee.setRect(event.layer.getRect());
            marquee.showRect();
            infoPanel.setData(event.layer);
            infoPanel.show();
        } else {
            marquee.hideRect();
            infoPanel.hide();
        }
    });

    document.getElementById('grid-options').addEventListener('change', function (event) {
        grid.setColor(new Color(document.getElementById('grid-color').value));
        grid.snapto = (document.getElementById('snap-to-grid').checked);
        marquee.setHitTest(function (xy) { return grid.hitTest(xy); });
        if (document.getElementById('show-grid').checked)
            grid.showGrid();
        else
            grid.hideGrid();
    });

    document.getElementById('background-color').addEventListener('change', function (event) {
        layerList.layers.backgroundColor = document.getElementById('background-color').value;
        layerList.layers.trigger('update');
    });

    document.getElementById('canvas-width').addEventListener('input', function (event) {
        canvas.setWidth(this.value);
    });

    document.getElementById('canvas-height').addEventListener('input', function (event) {
        canvas.setHeight(this.value);
    });

    document.getElementById('data').addEventListener('keyup', function (e) {
        layerList.layers.parseCSS(event.target.value);
        document.getElementById('background-color').value = layerList.layers.backgroundColor;
        marquee.hideRect();
    });
    
    layerList.layers.parseCSS(document.getElementById('data').value);

});