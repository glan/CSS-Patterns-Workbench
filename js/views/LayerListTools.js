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
            if (this.layerList.selectedLayers && event.type === 'click' && event.target.className === 'remove') {
                if ((this.layerList.selectedLayers.length === 1 && confirm('Delete selected layer?')) || (this.layerList.selectedLayers.length > 1 && confirm('Delete selected layers?'))) {
                    this.layerList.selectedLayers.forEach(function (layer) {
                        domLayer = $('#layers .layer[data-id='+layer.cid+']');
                        domLayer.fadeOut(function() {
                            domLayer.remove();
                        });
                    });
                    this.layerList.layers.remove(this.layerList.selectedLayers.toArray());
                    this.layerList.selectedLayers = new Layers();
                }
                this.layerList.layers.trigger('update');
                this.layerList.dispacheEvent('selection');
            } else if (this.layerList.selectedLayers && event.type === 'click' && event.target.className === 'duplicate') {
                var newLayers = new Layers();
                this.layerList.selectedLayers.forEach(function(layer) {
                    newLayers.add(layer.clone());
                });
                this.layerList.selectedLayers = newLayers;
                this.layerList.layers.add(this.layerList.selectedLayers.toArray());
                this.layerList.layers.sort();
                $('#layers .layer.selected').removeClass('selected');
                this.layerList.selectedLayers.forEach(function(layer) {
                    $('.layer[data-id='+layer.cid+']').addClass('selected');
                });
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
                this.layerList.selectedLayers = newLayers;
                $('#layers .layer.selected').removeClass('selected');
                this.layerList.selectedLayers.forEach(function(layer) {
                    $('.layer[data-id='+layer.cid+']').addClass('selected');
                });
                this.layerList.dispacheEvent('selection');
                event.target.value = '';
            }
        }
    }

    LayerListTools.prototype = layerListTools;
    return LayerListTools;

});