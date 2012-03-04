define('views/LayerAttributesPanel', ['models/Rect' ,'models/ColorStops', 'models/ColorStop'], function (Rect, ColorStops, ColorStop) {

    function LayerAttributesPanel() {
        //$('#info-panel').unbind();
        document.getElementById('info-panel').addEventListener('input', this);
        document.getElementById('info-panel').addEventListener('change', this);

        document.getElementById('info-panel').addEventListener('click', function (event) {
            var spawnEvent;
            if (event.target.className === 'remove') {
                spawnEvent = document.createEvent('UIEvents');
                event.target.parentNode.parentNode.removeChild(event.target.parentNode);
                spawnEvent.initUIEvent('change', true, true, window, 1);
                document.getElementById('info-panel').dispatchEvent(spawnEvent);
            }
        });

        document.getElementById('info_add_colorstop').addEventListener('click', function (event) {
            template = document.querySelector('#templates>.colorstop');
            document.getElementById('info_layer_stops').appendChild(template.cloneNode(true));
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

        $("#info_layer_stops").sortable({cursor:'-webkit-grabbing', containment:'document', items: 'li' });
        $("#info_layer_stops").disableSelection();

        // Nasty jQuery events relay hack for catching sortupdate as a real UI event
        var self = this;
        $('#info-panel').bind("sortupdate", function () {
            self.handleEvent();
        });
    }

    var layerAttributesPanel = {
        setData : function (layer) {
            var rect = layer.getRect();
            document.getElementById('info_size_width').value = rect.getWidth().getValue();
            document.getElementById('info_size_width_unit').value = rect.getWidth().getUnit();
            document.getElementById('info_size_height').value = rect.getHeight().getValue();
            document.getElementById('info_size_height_unit').value = rect.getHeight().getUnit();
            document.getElementById('info_position_x').value = rect.getLeft().getValue();
            document.getElementById('info_position_x_unit').value = rect.getLeft().getUnit();
            document.getElementById('info_position_y').value = rect.getTop().getValue();
            document.getElementById('info_position_y_unit').value = rect.getTop().getUnit();

            document.getElementById('info_repeating').checked = layer.getRepeating();

            document.getElementById('info_layer_composite').value = layer.attributes.composite;
            document.getElementById('info_layer_opacity').value = Math.round(layer.attributes.opacity * 100);
            document.getElementById('info_layer_opacity_range').value = Math.round(layer.attributes.opacity * 100);

            var template = document.querySelector('#templates>.colorstop');
            document.getElementById('info_layer_stops').innerHTML = '';
            layer.attributes.image.colorStops.getColorStops().forEach(function(colorStop) {
                var newStop = template.cloneNode(true);
                newStop.querySelector('.color').value = colorStop.color;
                if (colorStop.length) {
                    newStop.querySelector('.stop').value = colorStop.length.getValue();
                    newStop.querySelector('.unit').value = colorStop.length.getUnit();
                }
                document.getElementById('info_layer_stops').appendChild(newStop);
            });
        },
        handleEvent : function (event) {
            var spawnEvent = document.createEvent('UIEvents'), rect = new Rect({
                width: document.getElementById('info_size_width').value + document.getElementById('info_size_width_unit').value,
                height: document.getElementById('info_size_height').value + document.getElementById('info_size_height_unit').value,
                left: document.getElementById('info_position_x').value + document.getElementById('info_position_x_unit').value,
                top: document.getElementById('info_position_y').value + document.getElementById('info_position_y_unit').value
            });

            spawnEvent.initUIEvent('infopanel_update', true, true, window, 1);
            spawnEvent.rect = rect;
            spawnEvent.repeating = document.getElementById('info_repeating').checked;
            spawnEvent.composite = document.getElementById('info_layer_composite').value;
            spawnEvent.opacity = document.getElementById('info_layer_opacity').value / 100;

            spawnEvent.colorStops = new ColorStops();
            $('#info-panel .colorstops .colorstop').each(function(e, el) {
                spawnEvent.colorStops.add(new ColorStop(el.querySelector('.color').value + ((el.querySelector('.stop').value != '') ? + ' ' + el.querySelector('.stop').value + el.querySelector('.unit').value : '')));
            });
            document.dispatchEvent(spawnEvent);
        },
        show : function () {
            $(document.getElementById('right-bar')).addClass('show-lower');
        },
        hide : function () {
            $(document.getElementById('right-bar')).removeClass('show-lower');
        }
    }

    LayerAttributesPanel.prototype = layerAttributesPanel;
    return LayerAttributesPanel;

});