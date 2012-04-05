/**
 * © Glan Thomas 2012
 */

define('views/LayerAttributesPanel', ['models/Rect', 'models/Length', 'models/Direction', 'views/GradientEditor'], function (Rect, Length, Direction, GradientEditor) {
    'use strict';

    function LayerAttributesPanel() {
        //$('#info-panel').unbind();

        document.getElementById('info-panel').addEventListener('input', this);
        document.getElementById('info-panel').addEventListener('change', this);
        document.getElementById('info-panel').addEventListener('mousedown', this);
        document.getElementById('info-panel').addEventListener('mouseup', this);
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
                radio, canvas = document.getElementById('canvas'),
                width = parseInt(canvas.parentNode.style.width),
                height = parseInt(canvas.parentNode.style.height),
                denormalRect, normalRect, newRect;

            spawnEvent.initUIEvent('infopanel_update', true, true, window, 1);

            if (event.type === 'gradient_update') {
                spawnEvent.dontSave = event.dontSave;
            } else if (event.type === 'change' && event.target.type === 'number') {
                return;
            } else if (event.type === 'mousedown') {
                this.mouseTarget = event.target;
                this.mouseTargetValue = event.target.value;
                return;
            } else if (event.type === 'mouseup') {
                if (this.mouseTarget && this.mouseTarget.type === 'range' && this.mouseTargetValue !== this.mouseTarget.value)
                    spawnEvent.dontSave = false;
                else
                    return;
            } else if (event.target.type === 'range') {
                spawnEvent.dontSave = true;
            } else {
                spawnEvent.dontSave = this.dontSave;
            }

            spawnEvent.aspectLock = document.getElementById('info_size_aspect_lock').checked;
            if (spawnEvent.aspectLock) {
                if (event.target.id === 'info_size_width') {
                    document.getElementById('info_size_height').value = Math.round(document.getElementById('info_size_width').value / document.getElementById('info_size_aspect_lock').value);
                } else if (event.target.id === 'info_size_height') {
                    document.getElementById('info_size_width').value = Math.round(document.getElementById('info_size_height').value * document.getElementById('info_size_aspect_lock').value);
                }
            }

            var unit_x = document.getElementById('info_position_x_unit').value,
                unit_y = document.getElementById('info_position_y_unit').value,
                unit_w = document.getElementById('info_size_width_unit').value,
                unit_h = document.getElementById('info_size_height_unit').value;

            if (event.type === 'change' && event.target.id === 'info_position_x_unit') {
                unit_x = (event.target.value === 'px') ? '%' : 'px';
            } else if (event.type === 'change' && event.target.id === 'info_position_y_unit') {
                unit_y = (event.target.value === 'px') ? '%' : 'px';
            } else if (event.type === 'change' && event.target.id === 'info_size_width_unit') {
                unit_w = (event.target.value === 'px') ? '%' : 'px';
            } else if (event.type === 'change' && event.target.id === 'info_size_height_unit') {
                unit_h = (event.target.value === 'px') ? '%' : 'px';
            }

            newRect = new Rect({
                width: ((document.getElementById('info_size_width').value > 0) ? document.getElementById('info_size_width').value : 1) + unit_w,
                height: ((document.getElementById('info_size_height').value > 0) ? document.getElementById('info_size_height').value : 1) + unit_h,
                left: document.getElementById('info_position_x').value + unit_x,
                top: document.getElementById('info_position_y').value + unit_y
            });

            denormalRect = newRect.denormalize(width, height);
            normalRect = newRect.normalize(width, height);

            if (event.type === 'change' && event.target.id === 'info_position_x_unit') {
                newRect.setLeft(((event.target.value === 'px') ? denormalRect : normalRect).getLeft());
            } else if (event.type === 'change' && event.target.id === 'info_position_y_unit') {
                newRect.setTop(((event.target.value === 'px') ? denormalRect : normalRect).getTop());
            } else if (event.type === 'change' && event.target.id === 'info_size_width_unit') {
                newRect.setWidth(((event.target.value === 'px') ? denormalRect : normalRect).getWidth());
            } else if (event.type === 'change' && event.target.id === 'info_size_height_unit') {
                newRect.setHeight(((event.target.value === 'px') ? denormalRect : normalRect).getHeight());
            }

            document.getElementById('info_position_x').value = newRect.getLeft().getValue();
            document.getElementById('info_position_y').value = newRect.getTop().getValue();
            document.getElementById('info_size_width').value = newRect.getWidth().getValue();
            document.getElementById('info_size_height').value = newRect.getHeight().getValue();

            spawnEvent.rect = newRect;

            if (!spawnEvent.aspectLock) {
                document.getElementById('info_size_aspect_lock').value = spawnEvent.rect.getAspect();
            }

            spawnEvent.repeating = document.getElementById('info_repeating').checked;
            spawnEvent.repeat = document.getElementById('info_repeat').value;
            spawnEvent.composite = document.getElementById('info_layer_composite').value;
            spawnEvent.opacity = document.getElementById('info_layer_opacity').value / 100;

            spawnEvent.image = {};
            spawnEvent.image.position = {};



            unit_x = document.getElementById('info_radial_position_x_units').value,
            unit_y = document.getElementById('info_radial_position_y_units').value,
            unit_w = document.getElementById('info_radial_size_width_units').value,
            unit_h = document.getElementById('info_radial_size_height_units').value;

            if (event.type === 'change' && event.target.id === 'info_radial_position_x_units') {
                unit_x = (event.target.value === 'px') ? '%' : 'px';
            } else if (event.type === 'change' && event.target.id === 'info_radial_position_y_units') {
                unit_y = (event.target.value === 'px') ? '%' : 'px';
            } else if (event.type === 'change' && event.target.id === 'info_radial_size_width_units') {
                unit_w = (event.target.value === 'px') ? '%' : 'px';
            } else if (event.type === 'change' && event.target.id === 'info_radial_size_height_units') {
                unit_h = (event.target.value === 'px') ? '%' : 'px';
            }

            width = denormalRect.getWidth().getValue();
            height = denormalRect.getHeight().getValue();

            var newNewRect = new Rect({
                left : document.getElementById('info_radial_position_x').value + unit_x,
                top : document.getElementById('info_radial_position_y').value + unit_y,
                width : document.getElementById('info_radial_size_width').value + unit_w,
                height : document.getElementById('info_radial_size_height').value + unit_h
            });

            denormalRect = newNewRect.denormalize(width, height);
            normalRect = newNewRect.normalize(width, height);

            if (event.type === 'change' && event.target.id === 'info_radial_position_x_units') {
                newNewRect.setLeft(((event.target.value === 'px') ? denormalRect : normalRect).getLeft());
            } else if (event.type === 'change' && event.target.id === 'info_radial_position_y_units') {
                newNewRect.setTop(((event.target.value === 'px') ? denormalRect : normalRect).getTop());
            } else if (event.type === 'change' && event.target.id === 'info_radial_size_width_unit') {
                newNewRect.setWidth(((event.target.value === 'px') ? denormalRect : normalRect).getWidth());
            } else if (event.type === 'change' && event.target.id === 'info_radial_size_height_unit') {
                newNewRect.setHeight(((event.target.value === 'px') ? denormalRect : normalRect).getHeight());
            }

            document.getElementById('info_radial_position_x').value = newNewRect.getLeft().getValue();
            document.getElementById('info_radial_position_y').value = newNewRect.getTop().getValue();
            document.getElementById('info_radial_size_width').value = newNewRect.getWidth().getValue();
            document.getElementById('info_radial_size_height').value = newNewRect.getHeight().getValue();


            spawnEvent.image.shape = document.getElementById('info_radial_shape').value;
            spawnEvent.image.size = document.getElementById('info_radial_size').value;
            spawnEvent.image.position.x = new Length().parseLength(document.getElementById('info_radial_position_x').value + document.getElementById('info_radial_position_x_units').value);
            spawnEvent.image.position.y = new Length().parseLength(document.getElementById('info_radial_position_y').value + document.getElementById('info_radial_position_y_units').value);
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