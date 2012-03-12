/**
 * © Glan Thomas 2012
 */

define('views/LayerList', ['jquery', 'models/Layer', 'models/Direction', 'models/ColorStop', 'models/ColorStops', 'models/GradientLinear', 'models/GradientRadial'], function ($, Layer, Direction, ColorStop, ColorStops, GradientLinear, GradientRadial) {
    'use strict';

    function LayerList (layers) {
        this.layers = layers;
        this.selectedLayer = null;
        /*this.layers.bind('remove', function (e) {
            this.layers.trigger('update');
        });*/
        var self = this
        this.layers.bind('reset', function (e) {
           self.reset();
        });

        $("#layers").sortable({cursor:'-webkit-grabbing', containment:'document', axis: 'y' });
        $("#layers").disableSelection();

        document.getElementById('layers').addEventListener('click', this);
        document.getElementById('layers').addEventListener('mousedown', this);
        
        // capture layer deselection event
        document.getElementById('frame').addEventListener('mousedown', this);

        document.getElementById('layer-man-tools').addEventListener('click', this);

        document.getElementById('layers').addEventListener('sortupdate', this, true);
        // Nasty jQuery events relay hack for catching sortupdate as a real UI event
        $('#layers').parent().bind("sortupdate", function() {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("sortupdate", false, false, window, 1);
            document.getElementById('layers').dispatchEvent(spawnEvent);
        });
    }

     function updatePreview(layer) {
        var prefixes = ['-webkit', '-moz'],
            css = '';
        prefixes.forEach(function(prefix) {
            css += 'background:'+layer.getImage(prefix) + ';';
        });
        document.querySelector('.layer[data-id='+layer.cid+'] .preview').setAttribute('style', css);
    }

    var layerList = {
        reset : function() {
            document.getElementById('layers').innerHTML = '';
            this.layers.forEach(this.createDomLayer);
            this.layers.trigger('update');
        },

        createDomLayer : function (e) {
            var template = document.querySelector('#templates>.layer'),
                cid = e.cid,
                newLayer = template.cloneNode(true);
            newLayer.setAttribute('data-id',cid);
            newLayer.querySelector('.info.name').innerHTML = 'Layer ' + cid;
            newLayer.querySelector('.info.type').innerHTML = ((e.attributes.image.repeating) ? 'repeating-' : '' ) + e.attributes.image.name;
            newLayer.querySelector('.enabled').checked = e.attributes.enabled;
            e.bind('update', function() {
                updatePreview(e);
                document.querySelector('.layer[data-id='+cid+'] .info.type').innerHTML = ((this.attributes.image.repeating) ? 'repeating-' : '' ) + this.attributes.image.name;
            });
            document.getElementById('layers').appendChild(newLayer);
            updatePreview(e);
        },
        
        handleEvent : function(event) {
            var domLayer = $(event.target).closest('.layer'), orignalId,
                layer = this.layers.getByCid(domLayer.attr('data-id'));
            if (this.selectedLayer && event.type === 'click' && event.target.className === 'remove' && confirm('Delete selected layer?')) {
                domLayer = $('#layers .layer[data-id='+this.selectedLayer.cid+']');
                domLayer.fadeOut(function() { 
                    domLayer.remove();
                });
                this.selectedLayer.destroy();
                this.selectedLayer = null;
                this.layers.trigger('update');
                this.dispacheEvent('selection');
            } else if (this.selectedLayer && event.type === 'click' && event.target.className === 'duplicate') {
                orignalId = this.selectedLayer.cid;
                this.selectedLayer = this.selectedLayer.clone();
                this.selectedLayer.attributes.image = $.extend({}, this.selectedLayer.attributes.image);
                this.selectedLayer.attributes.order = 1 * this.selectedLayer.attributes.order + 0.01;
                this.layers.add(this.selectedLayer);
                this.layers.sort();
                $('#layers .layer.selected').removeClass('selected');
                $('.layer[data-id='+this.selectedLayer.cid+']').addClass('selected');
                this.dispacheEvent('selection');
            } else if (event.type === 'click' && event.target.className === 'add') {
                switch(event.target.value) {
                case 'linear-gradient':
                    layer = new Layer();
                    layer.attributes.image = new GradientLinear('linear-gradient', false, new Direction(), new ColorStops().add(new ColorStop('transparent')).add(new ColorStop('transparent')));
                    layer.attributes.order = 0;
                    layer.attributes.size = '100px 100px';
                    layer.attributes.enabled = true;
                    layer.attributes.opacity = 1;
                    layer.attributes.composite = 'source-over';
                    this.layers.add(layer);
                    this.layers.sort();
                    this.selectedLayer = layer;
                    $('#layers .layer.selected').removeClass('selected');
                    $('.layer[data-id='+layer.cid+']').addClass('selected');
                    break;
                case 'radial-gradient':
                    layer = new Layer();
                    layer.attributes.image = new GradientRadial('radial-gradient', false, '', '', '', '', new ColorStops().add(new ColorStop('transparent')).add(new ColorStop('transparent')));
                    layer.attributes.order = 0;
                    layer.attributes.size = '100px 100px';
                    layer.attributes.enabled = true;
                    layer.attributes.opacity = 1;
                    layer.attributes.composite = 'source-over';
                    this.layers.add(layer);
                    this.layers.sort();
                    this.selectedLayer = layer;
                    $('#layers .layer.selected').removeClass('selected');
                    $('.layer[data-id='+layer.cid+']').addClass('selected');
                    break;
                }
                this.dispacheEvent('selection');
                event.target.value = '';
            } else if (domLayer && event.type === 'mousedown') {
                $('#layers .layer.selected').removeClass('selected');
                this.selectedLayer = null;
                if (layer) {
                    domLayer.addClass('selected');
                    this.selectedLayer = layer;
                }
                // Fire layer selected event
                this.dispacheEvent('selection');
            } else if (domLayer && event.type === 'click' && event.target.className === 'enabled') {
                layer.attributes.enabled = event.target.checked;
                this.layers.trigger('update');
            } else if (event.type === 'sortupdate') {
                var newOrder = [];
                $("#layers .layer").each(function(e, ee) {
                    newOrder.push(ee.getAttribute('data-id'));
                });
                this.layers.reorder(newOrder);
            }
        },

        dispacheEvent : function(name) {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("layerlist_" + name, true, true, window, 1);
            spawnEvent.layer = this.selectedLayer;
            document.dispatchEvent(spawnEvent);
        }
    }
    
    LayerList.prototype = layerList;
    return LayerList;
});