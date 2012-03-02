define('views/LayerPanel', function () {

    function LayerPanel() {
        document.getElementById('info_layer_opacity_range').addEventListener('change', function(event) {
            document.getElementById('info_layer_opacity').value = this.value;
        });
        document.getElementById('info_layer_opacity').addEventListener('input', function(event) {
            document.getElementById('info_layer_opacity_range').value = this.value;
        });

        document.getElementById('info-panel2').addEventListener('change', this);
        document.getElementById('info-panel2').addEventListener('input', this);
        
    }

    var layerPanel = {
        setData : function (layer) {
            document.getElementById('info_layer_composite').value = layer.attributes.composite;
            document.getElementById('info_layer_opacity').value = Math.round(layer.attributes.opacity * 100);
            document.getElementById('info_layer_opacity_range').value = Math.round(layer.attributes.opacity * 100);
        },
        handleEvent : function (event) {
            var spawnEvent = document.createEvent('UIEvents'),
                composite = document.getElementById('info_layer_composite').value,
                opacity = document.getElementById('info_layer_opacity').value / 100;
            spawnEvent.initUIEvent('layerpanel_update', true, true, window, 1);
            spawnEvent.composite = composite;
            spawnEvent.opacity = opacity;
            document.dispatchEvent(spawnEvent);
        },
        enable : function () {
            document.getElementById('info-panel2').className = 'enabled';
            $('#info-panel2 input').attr('disabled', false);
            $('#info-panel2 select').attr('disabled', false);
        },
        disable : function () {
            document.getElementById('info-panel2').className = 'disabled';
            $('#info-panel2 input').attr('disabled', true);
            $('#info-panel2 select').attr('disabled', true);
        }
    }

    LayerPanel.prototype = layerPanel;
    return LayerPanel;

});