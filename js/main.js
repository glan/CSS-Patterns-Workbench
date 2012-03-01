require(['jquery', 
'models/Layers',
'views/Marquee',
'views/InfoPanel',
'views/Canvas',
'views/Grid',
'views/LayerList',
'js/vendor/jquery-ui-1.8.14.custom.min.js'], function($, Layers, Marquee, InfoPanel, Canvas, Grid, LayerList) {
    'use strict';
    var layerList = new LayerList(new Layers()),
        grid = new Grid(),
        marquee = new Marquee(document.getElementById('grid'), grid),
        infoPanel = new InfoPanel(),
        canvas = new Canvas();

    document.addEventListener('marquee_move', updateView);
    document.addEventListener('marquee_resize', updateView);
    document.addEventListener('infopanel_update', updateView);

    function updateView(event) {
        if (event.type === 'infopanel_update') {
            marquee.setRect(event.rect);
        } else if (event.type === 'marquee_move' || event.type === 'marquee_resize') {
            infoPanel.setRect(event.rect);
        }
        layerList.selectedLayer.setRect(event.rect);
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
        marquee.setRect(event.layer.getRect());
        marquee.showRect();
        infoPanel.setRect(event.layer.getRect());
    });

    document.getElementById('grid-options').addEventListener('change', function (event) {
        grid.setColor(document.getElementById('grid-color').value);
        grid.snapto = (document.getElementById('snap-to-grid').checked);
        if (document.getElementById('show-grid').checked)
            grid.showGrid();
        else
            grid.hideGrid();
    });

    document.getElementById('background-color').addEventListener('change', function (event) {
        layerList.layers.backgroundColor = document.getElementById('background-color').value;
        layerList.layers.trigger('update');
    });

    document.getElementById('data').addEventListener('keyup', function (e) {
        layerList.layers.parseCSS(event.target.value);
        document.getElementById('background-color').value = layerList.layers.backgroundColor;
        marquee.hideRect();
    });
    
    layerList.layers.parseCSS(document.getElementById('data').value);
});