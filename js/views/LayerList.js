define('views/LayerList', function () {

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

        $("#layers").sortable({cursor:'-webkit-grabbing'});
        $("#layers").disableSelection();

        document.getElementById('layers').addEventListener('click', this);
        document.getElementById('layers').addEventListener('mousedown', this);
        
        // capture layer deselection event
        document.getElementById('frame').addEventListener('mousedown', this);

        document.addEventListener('sortupdate', this, true);
        // Nasty jQuery events relay hack for catching sortupdate as a real UI event
        $(document).bind("sortupdate", function() {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("sortupdate", false, false, window, 1);
            document.getElementById('layers').dispatchEvent(spawnEvent);
        });
    }

    var layerList = {
        reset : function() {
            var template = document.querySelector('#templates>.layer'),
                domLayers = document.getElementById('layers');

            this.layers.trigger('update');

            domLayers.innerHTML = '';
            this.layers.forEach(function(e) {
                var cid = e.cid;
                var newLayer = template.cloneNode(true);
                newLayer.setAttribute('data-id',cid);
                newLayer.querySelector('.preview').style.background = e.attributes.image.toString();
                newLayer.querySelector('.info.name').innerHTML = 'Layer ' + cid;
                newLayer.querySelector('.info.type').innerHTML = ((e.attributes.image.repeating) ? 'repeating-' : '' ) + e.attributes.image.name;
                newLayer.querySelector('.enabled').checked = e.attributes.enabled;
                e.bind('update', function() {
                    document.querySelector('.layer[data-id='+cid+'] .preview').style.background = this.getImage();
                    document.querySelector('.layer[data-id='+cid+'] .info.type').innerHTML = ((this.attributes.image.repeating) ? 'repeating-' : '' ) + this.attributes.image.name;
                });
                domLayers.appendChild(newLayer);
            });
        },
        
        handleEvent : function(event) {
            var domLayer = $(event.target).closest('.layer'), 
                layer = this.layers.getByCid(domLayer.attr('data-id'));
            if (event.type === 'click' && event.target.className === 'remove' && confirm('Remove layer?')) {
                if (this.selectedLayer === layer)
                    this.selectedLayer = null;
                domLayer.fadeOut(function() { 
                    domLayer.remove();
                });
                layer.destroy();
                this.layers.trigger('update');
                this.dispacheEvent('selection');
            } else if (event.type === 'mousedown') {
                $('#layers .layer.selected').removeClass('selected');
                this.selectedLayer = null;
                if (layer) {
                    domLayer.addClass('selected');
                    this.selectedLayer = layer;
                }
                // Fire layer selected event
                this.dispacheEvent('selection');
            } else if (event.type === 'click' && event.target.className === 'enabled') {
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