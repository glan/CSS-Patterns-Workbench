define('views/LayerListTools', ['vendor/underscore', 'jquery', 'models/Layers', 'presets/patterns'], function (_, $, Layers, patterns) {
    'use strict';

    function LayerListTools (layerList) {
        var presetsList = document.getElementById('pattern-presets');
        this.layerList = layerList;
        document.getElementById('layer-man-tools').addEventListener('click', this, true, true);
        document.getElementById('layer-man-tools').addEventListener('mousedown', this, true, true);

        patterns.forEach(function (pattern) {
            var layers = new Layers(),
                option = document.createElement('div'),
                trans = document.createElement('div');
            layers.parseCSS(pattern);
            layers.forEach(function (layer) {
                layer.attributes.size = '50px 50px';
            });
            trans.className = 'trans';
            option.className = 'preset';
            option.setAttribute('data-value', pattern);
            option.setAttribute('style', layers.toString(['-webkit', '-moz']));
            trans.appendChild(option);
            presetsList.appendChild(trans);
        });

        document.body.addEventListener('click', function() {
            $('#pattern-presets').removeClass('show');
            $('#pattern-add').removeClass('active');
        });
    }
    
    var layerListTools = {
        handleEvent : function(event) {
            var domLayer = $(event.target).closest('.layer'),
                orignalId,
                newLayers,
                layer = this.layerList.layers.getByCid(domLayer.attr('data-id')),
                first = this.layerList.layers.first();
                //console.log(event);
            if (this.layerList.selectedLayer && event.type === 'click' && event.target.className === 'remove' && confirm('Delete selected layer?')) {
                domLayer = $('#layers .layer[data-id='+this.layerList.selectedLayer.cid+']');
                domLayer.fadeOut(function() { 
                    domLayer.remove();
                });
                this.layerList.selectedLayer.destroy();
                this.layerList.selectedLayer = null;
                this.layerList.layers.trigger('update');
                this.layerList.dispacheEvent('selection');
            } else if (this.layerList.selectedLayer && event.type === 'click' && event.target.className === 'duplicate') {
                orignalId = this.layerList.selectedLayer.cid;
                this.layerList.selectedLayer = this.layerList.selectedLayer.clone();
                this.layerList.selectedLayer.attributes.image = $.extend({}, this.layerList.selectedLayer.attributes.image);
                this.layerList.selectedLayer.attributes.order = 1 * this.layerList.selectedLayer.attributes.order - 0.01;
                this.layerList.layers.add(this.layerList.selectedLayer);
                this.layerList.layers.sort();
                $('#layers .layer.selected').removeClass('selected');
                $('.layer[data-id='+this.layerList.selectedLayer.cid+']').addClass('selected');
                this.layerList.dispacheEvent('selection');
            } else if (event.type === 'mousedown' && event.target.id === 'pattern-add') {
                $('#pattern-presets').toggleClass('show');
                $('#pattern-add').toggleClass('active');
            } else if (event.type === 'click' && event.target.id === 'pattern-add') {
                event.stopPropagation();
            } else if (event.type === 'click' && event.target.className === 'preset') {
                $('#pattern-presets').removeClass('show');
                $('#pattern-add').removeClass('active');
                newLayers = new Layers();
                newLayers.parseCSS(event.target.getAttribute('data-value'));
                newLayers.forEach(function (layer) {
                    if (first) {
                        layer.attributes.order = first.attributes.order - 1;
                    }
                });
                this.layerList.layers.reset(_.union(this.layerList.layers.toArray(), newLayers.toArray()));
                this.layerList.selectedLayer = this.layerList.layers.first();
                $('#layers .layer.selected').removeClass('selected');
                $('.layer[data-id='+this.layerList.selectedLayer.cid+']').addClass('selected');
                this.layerList.dispacheEvent('selection');
                event.target.value = '';
            }
        }
    }

    LayerListTools.prototype = layerListTools;
    return LayerListTools;

});