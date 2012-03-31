/**
 * © Glan Thomas 2012
 */

define('views/LayerAttributesPanel', ['models/Rect', 'models/Length', 'models/Direction', 'views/GradientEditor'], function (Rect, Length, Direction, GradientEditor) {
    'use strict';

    function LayerAttributesPanel() {
        //$('#info-panel').unbind();
        document.getElementById('info-panel').addEventListener('input', this);
        document.getElementById('info-panel').addEventListener('change', this);
        document.addEventListener('gradient_update', this);

        document.getElementById('info_linear_direction').addEventListener('focus', function(event) {
            document.querySelector('#info_linear_direction_set input[type=radio].manual').checked = true;
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent('change', true, true, window, 1);
            document.getElementById('info-panel').dispatchEvent(spawnEvent);
        });

        document.getElementById('info_layer_opacity_range').addEventListener('change', function(event) {
            document.getElementById('info_layer_opacity').value = this.value;
        });
        document.getElementById('info_layer_opacity').addEventListener('input', function(event) {
            document.getElementById('info_layer_opacity_range').value = this.value;
        });

        document.getElementById('info-hsl-hue-range').addEventListener('change', function(event) {
            document.getElementById('info-hsl-hue').value = this.value;
        });
        document.getElementById('info-hsl-hue').addEventListener('input', function(event) {
            document.getElementById('info-hsl-hue-range').value = this.value;
        });

        document.getElementById('info-hsl-saturation-range').addEventListener('change', function(event) {
            document.getElementById('info-hsl-saturation').value = this.value;
        });
        document.getElementById('info-hsl-saturation').addEventListener('input', function(event) {
            document.getElementById('info-hsl-saturation-range').value = this.value;
        });

        document.getElementById('info-hsl-lightness-range').addEventListener('change', function(event) {
            document.getElementById('info-hsl-lightness').value = this.value;
        });
        document.getElementById('info-hsl-lightness').addEventListener('input', function(event) {
            document.getElementById('info-hsl-lightness-range').value = this.value;
        });

        this.gradientEditor = new GradientEditor();
    }

    var layerAttributesPanel = {
        setData : function (layers, lockAspect) {
            var layer = layers.first(),
                image = layer.get('image'),
                rect = layers.getRect(),
                radio;

            document.getElementById('info_size_width').value = Math.round(1 * rect.getWidth().getValue());
            document.getElementById('info_size_width_unit').value = rect.getWidth().getUnit();
            document.getElementById('info_size_height').value = Math.round(1 * rect.getHeight().getValue());
            document.getElementById('info_size_height_unit').value = rect.getHeight().getUnit();
            document.getElementById('info_position_x').value = Math.round(1 * rect.getLeft().getValue());
            document.getElementById('info_position_x_unit').value = rect.getLeft().getUnit();
            document.getElementById('info_position_y').value = Math.round(1 * rect.getTop().getValue());
            document.getElementById('info_position_y_unit').value = rect.getTop().getUnit();

            document.getElementById('info_repeating').checked = layer.getRepeating();
            document.getElementById('info_repeat').value = layer.getRepeat();

            document.getElementById('info_size_aspect_lock').checked = lockAspect;
            document.getElementById('info_size_aspect_lock').value = rect.getAspect();

            document.getElementById('info_layer_composite').value = layer.get('composite');
            document.getElementById('info_layer_opacity').value = Math.round(layers.getOpacity() * 100);
            document.getElementById('info_layer_opacity_range').value = Math.round(layers.getOpacity() * 100);

            this.hue = document.getElementById('info-hsl-hue').value = document.getElementById('info-hsl-hue-range').value = 0;
            this.saturation = document.getElementById('info-hsl-saturation').value = document.getElementById('info-hsl-saturation-range').value = 0;
            this.lightness = document.getElementById('info-hsl-lightness').value = document.getElementById('info-hsl-lightness-range').value = 0;

            if (layers.length > 1) {
                document.getElementById('info-panel').className = 'multi';
            } else {
                if (image.get('name') === 'radial-gradient') {
                    document.getElementById('info-panel').className = 'single radial';

                    document.getElementById('info_radial_shape').value = image.get('shape');
                    document.getElementById('info_radial_size').value = image.get('size');

                    document.getElementById('info_radial_position_x').value = image.getPosition().x.getValue();
                    document.getElementById('info_radial_position_x_units').value = image.getPosition().x.getUnit();

                    document.getElementById('info_radial_position_y').value = image.getPosition().y.getValue();
                    document.getElementById('info_radial_position_y_units').value = image.getPosition().y.getUnit();

                    document.getElementById('info_radial_size_width').value = image.get('width').getValue();
                    document.getElementById('info_radial_size_width_units').value = image.get('width').getUnit();

                    document.getElementById('info_radial_size_height').value = image.get('height').getValue();
                    document.getElementById('info_radial_size_height_units').value = image.get('height').getUnit();

                } else if (image.get('name') === 'linear-gradient') {
                    document.getElementById('info-panel').className = 'single linear';

                    radio = document.querySelector('#info_linear_direction_set input[value=\''+image.get('direction').toString()+'\']');
                    if (radio)
                        radio.checked = true;
                    else
                        document.querySelector('#info_linear_direction_set input[type=radio].manual').checked = true;
                    document.getElementById('info_linear_direction').value = image.get('direction').getValue();
                }

                document.getElementById('info-hsl-hue-range').value = document.getElementById('info-hsl-hue').value = this.hue = ((180 - layer.get('hue')) % 360) - 180;
                document.getElementById('info-hsl-saturation-range').value = document.getElementById('info-hsl-saturation').value = this.saturation = layer.get('saturation');
                document.getElementById('info-hsl-lightness-range').value = document.getElementById('info-hsl-lightness').value = this.lightness = layer.get('lightness');

                document.getElementById('info_layer_stops').innerHTML = '';

                this.gradientEditor.setData(image.get('colorStops'));
            }
        },

        handleEvent : function (event) {
            // We need to suppress change events for the colorstop field since these should only use input
            var spawnEvent = document.createEvent('UIEvents'),
                radio;

            spawnEvent.initUIEvent('infopanel_update', true, true, window, 1);

            spawnEvent.aspectLock = document.getElementById('info_size_aspect_lock').checked;
            if (spawnEvent.aspectLock) {
                if (event.target.id === 'info_size_width') {
                    document.getElementById('info_size_height').value = Math.round(document.getElementById('info_size_width').value / document.getElementById('info_size_aspect_lock').value);
                } else if (event.target.id === 'info_size_height') {
                    document.getElementById('info_size_width').value = Math.round(document.getElementById('info_size_height').value * document.getElementById('info_size_aspect_lock').value);
                }
            }

            spawnEvent.rect = new Rect({
                width: ((document.getElementById('info_size_width').value > 0) ? document.getElementById('info_size_width').value : 1) + document.getElementById('info_size_width_unit').value,
                height: ((document.getElementById('info_size_height').value > 0) ? document.getElementById('info_size_height').value : 1) + document.getElementById('info_size_height_unit').value,
                left: document.getElementById('info_position_x').value + document.getElementById('info_position_x_unit').value,
                top: document.getElementById('info_position_y').value + document.getElementById('info_position_y_unit').value
            });

            if (!spawnEvent.aspectLock) {
                document.getElementById('info_size_aspect_lock').value = spawnEvent.rect.getAspect();
            }

            spawnEvent.repeating = document.getElementById('info_repeating').checked;
            spawnEvent.repeat = document.getElementById('info_repeat').value;
            spawnEvent.composite = document.getElementById('info_layer_composite').value;
            spawnEvent.opacity = document.getElementById('info_layer_opacity').value / 100;

            spawnEvent.image = {};
            spawnEvent.image.position = {};
            spawnEvent.image.position.x = new Length().parseLength(document.getElementById('info_radial_position_x').value + document.getElementById('info_radial_position_x_units').value);
            spawnEvent.image.position.y = new Length().parseLength(document.getElementById('info_radial_position_y').value + document.getElementById('info_radial_position_y_units').value);
            spawnEvent.image.shape = document.getElementById('info_radial_shape').value;
            spawnEvent.image.size = document.getElementById('info_radial_size').value;
            spawnEvent.image.width = new Length().parseLength(document.getElementById('info_radial_size_width').value + document.getElementById('info_radial_size_width_units').value);
            spawnEvent.image.height = new Length().parseLength(document.getElementById('info_radial_size_height').value + document.getElementById('info_radial_size_height_units').value);

            spawnEvent.hue = this.hue - (1 * document.getElementById('info-hsl-hue').value);
            this.hue = 1 * document.getElementById('info-hsl-hue').value;

            spawnEvent.saturation = (1 * document.getElementById('info-hsl-saturation').value) - this.saturation;
            this.saturation = 1 * document.getElementById('info-hsl-saturation').value;

            spawnEvent.lightness = (1 * document.getElementById('info-hsl-lightness').value) - this.lightness;
            this.lightness = 1 * document.getElementById('info-hsl-lightness').value;

            radio = document.querySelector('#info_linear_direction_set input:checked');
            if (radio && radio.value) {
                spawnEvent.image.direction = new Direction(radio.value);
            } else {
                spawnEvent.image.direction = new Direction(document.getElementById('info_linear_direction').value + 'deg');
            }

            spawnEvent.colorStops = this.gradientEditor.colorStops;

            document.dispatchEvent(spawnEvent);
        },
        show : function () {
            $(document.body).addClass('showInfo');
        },
        hide : function () {
            $(document.body).removeClass('showInfo');
        }
    }

    LayerAttributesPanel.prototype = layerAttributesPanel;
    return LayerAttributesPanel;

});