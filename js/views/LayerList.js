/**
 * © Glan Thomas 2012
 */

define('views/LayerList', ['vendor/underscore', 'jquery', 'models/Layer', 'models/Layers', 'models/Direction', 'models/ColorStop', 'models/ColorStops', 'models/GradientLinear', 'models/GradientRadial', 'views/LayerListTools'], 
function (_, $, Layer, Layers, Direction, ColorStop, ColorStops, GradientLinear, GradientRadial, LayerListTools) {
    'use strict';

    function LayerList (layers) {
        this.layers = layers;
        this.selectedLayers = new Layers();
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

        document.getElementById('layers').addEventListener('sortupdate', this, true);
        // Nasty jQuery events relay hack for catching sortupdate as a real UI event
        $('#layers').parent().bind("sortupdate", function() {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("sortupdate", false, false, window, 1);
            document.getElementById('layers').dispatchEvent(spawnEvent);
        });

        new LayerListTools(this);

     }

     function updatePreview(layer) {
        var css = PrefixFree.prefixCSS('background:'+layer.getImage() + ';');
        document.querySelector('.layer[data-id='+layer.cid+'] .preview').setAttribute('style', css);
    }

    var layerList = {
        reset : function() {
            document.getElementById('layers').innerHTML = '';
            this.layers.forEach(this.createDomLayer);
            this.layers.trigger('update');
        },

        createDomLayer : function (layer) {
            var template = document.querySelector('#templates>.layer'),
                cid = layer.cid,
                newLayer = template.cloneNode(true);
            newLayer.setAttribute('data-id',cid);
            newLayer.querySelector('.info.name').innerHTML = layer.attributes.name;
            newLayer.querySelector('.info.type').innerHTML = ((layer.attributes.image.repeating) ? 'repeating-' : '' ) + layer.attributes.image.name;
            newLayer.querySelector('.enabled').checked = layer.attributes.enabled;
            layer.bind('update', function() {
                updatePreview(layer);
                document.querySelector('.layer[data-id='+cid+'] .info.type').innerHTML = ((this.attributes.image.repeating) ? 'repeating-' : '' ) + this.attributes.image.name;
            });
            document.getElementById('layers').appendChild(newLayer);
            updatePreview(layer);
        },

        handleEvent : function(event) {
            var first, ingroup, self,
                domLayer = $(event.target).closest('.layer'),
                layer = this.layers.getByCid(domLayer.attr('data-id'));
            if (domLayer && event.type === 'mousedown') {
                if (layer) {
                    if (event.shiftKey) {
                        first = this.selectedLayers.first();
                        ingroup = false;
                        self = this;
                        this.selectedLayers = new Layers();
                        this.layers.forEach(function(l) {
                            if ((layer.attributes.order < first.attributes.order && l === layer) || (layer.attributes.order > first.attributes.order && l === first)) {
                                ingroup = !ingroup;
                            }
                            if (ingroup) {
                                self.selectedLayers.add(l);
                                $(document.querySelector('.layer[data-id='+l.cid+']')).addClass('selected');
                            }
                            if ((layer.attributes.order < first.attributes.order && l === first) || (layer.attributes.order > first.attributes.order && l === layer)) {
                                ingroup = !ingroup;
                            }
                        });
                        this.selectedLayers.sort();
                    } else {
                        if (event.metaKey) {
                            this.selectedLayers = this.selectedLayers || new Layers();
                        } else {
                            $('#layers .layer.selected').removeClass('selected');
                            this.selectedLayers = new Layers();
                        }
                        if (domLayer.hasClass('selected')) {
                            this.selectedLayers.remove(layer);
                            domLayer.removeClass('selected');
                        } else {
                            this.selectedLayers.add(layer);
                            domLayer.addClass('selected');
                        }
                    }
                } else {
                    $('#layers .layer.selected').removeClass('selected');
                    this.selectedLayers = new Layers();
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
            spawnEvent.layers = this.selectedLayers;
            document.dispatchEvent(spawnEvent);
        }
    }
    
    LayerList.prototype = layerList;
    return LayerList;
});