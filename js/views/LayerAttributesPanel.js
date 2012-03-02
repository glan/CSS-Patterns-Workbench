define('views/LayerAttributesPanel', ['models/Rect'], function (Rect) {

    function LayerAttributesPanel() {
        //$('#info-panel').unbind();
        document.getElementById('info-panel').addEventListener('input', this);
        document.getElementById('info-panel').addEventListener('change', this);
        document.getElementById('info-panel').addEventListener('mousedown', function (event) {
             event.stopPropagation();
        });
        document.getElementById('info_layer_opacity_range').addEventListener('change', function(event) {
            document.getElementById('info_layer_opacity').value = this.value;
        });
        document.getElementById('info_layer_opacity').addEventListener('input', function(event) {
            document.getElementById('info_layer_opacity_range').value = this.value;
        });
        document.getElementById('info_layer_opacity').addEventListener('focus', function(event) {
            document.getElementById('info_layer_opacity_range_helper').className = 'active';
        });
        document.getElementById('info_layer_opacity').addEventListener('click', function(event) {
            document.getElementById('info_layer_opacity_range_helper').className = 'active';
            event.stopPropagation();
        });
        document.addEventListener('click', function(event) {
            if (event.target.id != 'info_layer_opacity_range')
                document.getElementById('info_layer_opacity_range_helper').className = '';
        });
    }

    var layerAttributesPanel = {
        setData : function (layer) {
            this.rect = layer.getRect();
            document.getElementById('info_size_width').value = this.rect.getWidth().getValue();
            document.getElementById('info_size_width_unit').value = this.rect.getWidth().getUnit();
            document.getElementById('info_size_height').value = this.rect.getHeight().getValue();
            document.getElementById('info_size_height_unit').value = this.rect.getHeight().getUnit();
            document.getElementById('info_position_x').value =this. rect.getLeft().getValue();
            document.getElementById('info_position_x_unit').value = this.rect.getLeft().getUnit();
            document.getElementById('info_position_y').value = this.rect.getTop().getValue();
            document.getElementById('info_position_y_unit').value = this.rect.getTop().getUnit();
            
            document.getElementById('info_repeating').checked = layer.getRepeating();
            
            document.getElementById('info_layer_composite').value = layer.attributes.composite;
            document.getElementById('info_layer_opacity').value = Math.round(layer.attributes.opacity * 100);
            document.getElementById('info_layer_opacity_range').value = Math.round(layer.attributes.opacity * 100);
        },
        handleEvent : function (event) {
            var spawnEvent = document.createEvent('UIEvents');

            this.rect.getWidth().setValue(document.getElementById('info_size_width').value);
            this.rect.getWidth().setUnit(document.getElementById('info_size_width_unit').value);
            this.rect.getHeight().setValue(document.getElementById('info_size_height').value);
            this.rect.getHeight().setUnit(document.getElementById('info_size_height_unit').value);
            this.rect.getLeft().setValue(document.getElementById('info_position_x').value);
            this.rect.getLeft().setUnit(document.getElementById('info_position_x_unit').value);
            this.rect.getTop().setValue(document.getElementById('info_position_y').value);
            this.rect.getTop().setUnit(document.getElementById('info_position_y_unit').value);

            spawnEvent.initUIEvent('infopanel_update', true, true, window, 1);
            spawnEvent.rect = this.rect;
            spawnEvent.repeating = document.getElementById('info_repeating').checked;
            spawnEvent.composite = document.getElementById('info_layer_composite').value;
            spawnEvent.opacity = document.getElementById('info_layer_opacity').value / 100;
            document.dispatchEvent(spawnEvent);
        },
        show : function () {
            $(document.getElementById('info-panel')).addClass('show');
        },
        hide : function () {
            $(document.getElementById('info-panel')).removeClass('show');
        }
    }

    LayerAttributesPanel.prototype = layerAttributesPanel;
    return LayerAttributesPanel;

});