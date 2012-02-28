require(['jquery', 'cw/builder', 'cw/Layers', 'js/jquery-ui-1.8.14.custom.min.js'], function($, builder, Layers) {
 
    var layers = new Layers(), selectedLayer,
        drag = {}, resize = {};

    document.addEventListener('mousedown', function (event) {
        if ((event.type === 'mousedown') && (event.target.id === 'size-helper' || event.target.id === 'ants' )) {
            drag.offsetX = event.offsetX;
            drag.offsetY = event.offsetY;
            drag.active = true;
            $(document.body).addClass('moving');
        } else if ((event.type === 'mousedown') && (event.target.className === 'resize-helper')) {
            //[TODO] better var names
            resize.x = event.x;
            resize.y = event.y;
            resize.px = 1 * document.getElementById('info_position_x').value;
            resize.py = 1 * document.getElementById('info_position_y').value;
            resize.w = 1 * document.getElementById('info_size_width').value;
            resize.h = 1 * document.getElementById('info_size_height').value;
            resize.active = true;
            //[TODO] layer should have an assessor for getting the aspect
            var size = selectedLayer.attributes.size.split(' ');
            resize.aspect = parseInt(size[0]) / parseInt(size[1]);
            //console.log(event.target.getAttribute('data-type'))
            resize.type = event.target.getAttribute('data-type');
            $(document.body).addClass('resizing-' + resize.type);
        }
    });
    
    function updateLayers() {
        var sizeHelper = document.getElementById('size-helper'),
            layer = layers.getByCid(sizeHelper.getAttribute('data-layer')),
            x = document.getElementById('info_position_x').value + document.getElementById('info_position_x_unit').value,
            y = document.getElementById('info_position_y').value + document.getElementById('info_position_y_unit').value, 
            w = document.getElementById('info_size_width').value + document.getElementById('info_size_width_unit').value, 
            h = document.getElementById('info_size_height').value + document.getElementById('info_size_height_unit').value;
        //[TODO] These should be setters
        layer.attributes.position =  x + ' ' + y;
        layer.attributes.size = w + ' ' + h;
        sizeHelper.style.left = x ;
        sizeHelper.style.top = y ;
        sizeHelper.style.width = w;
        sizeHelper.style.height = h;
        layers.trigger('update');
    }

    document.addEventListener('mousemove', function (event) {
       //console.log(drag.active);
        var resizeHelper, sizeHelper, x, y, w, h, dx, dy, checkHeight = false, checkWidth = false;
        if ((event.type === 'mousemove' && drag.active) ) {
            //sizeHelper.style.webkitTransform = 'translate3d(' + (event.x - drag.offsetX) + 'px,' + (event.y - drag.offsetY) + 'px,0)';
            x = parseInt(event.x - drag.offsetX);
            y = parseInt(event.y - drag.offsetY);

            document.getElementById('info_position_x').value = x;
            document.getElementById('info_position_y').value = y;
            document.getElementById('info_position_x_unit').value = 'px';
            document.getElementById('info_position_y_unit').value = 'px';

            //var layer = layers.getByCid(sizeHelper.getAttribute('data-layer'));
            //layer.attributes.position = (event.x - drag.offsetX) + 'px ' + (event.y - drag.offsetY) + 'px';
            //layers.trigger('update');
            updateLayers();

        } else if ((event.type === 'mousemove' && resize.active) ) {
            dx = event.x - resize.x;
            dy = event.y - resize.y;

            w = resize.w;
            h = resize.h;

            switch (resize.type) {
                case 'se-resize' :
                    w = resize.w + dx;
                    h = resize.h + dy;
                break;
                case 'e-resize' :
                    w = resize.w + dx
                break;
                case 's-resize' :
                    h = resize.h + dy;
                break;
                case 'sw-resize' :
                    h = resize.h + dy;
                    checkWidth = true;
                break;
                case 'ne-resize' :
                    w = resize.w + dx;
                    checkHeight = true;
                break;
                case 'n-resize' :
                    checkHeight = true;
                break;
                case 'w-resize' :
                    checkWidth = true;
                break;
                case 'nw-resize' :
                    checkHeight = true;
                    checkWidth = true;
                break;
            }

            if (checkHeight) {
                h = resize.h - dy;
                if (h<1) {
                    y = event.y + h;
                    h = 1;
                } else {
                    y = event.y;
                }
            }
            if (checkWidth) {
                w = resize.w - dx;
                if (w<1) {
                    x = event.x + w;
                    w = 1;
                } else {
                    x = event.x;
                }
            }

            if (event.shiftKey)
            {
                switch (resize.type) {
                    case 'se-resize' :
                        if (resize.aspect > 1) {
                            h = w / resize.aspect;
                        } else {
                            w = h * resize.aspect;
                        }
                    break;
                    case 'e-resize' :
                        h = w / resize.aspect;
                    break;
                    case 's-resize' :
                        w = h * resize.aspect;
                    break;
                    case 'n-resize' :
                        w = h * resize.aspect;
                    break;
                    case 'w-resize' :
                        h = w / resize.aspect;
                    break;
                    case 'ne-resize' :
                        if (resize.aspect > 1) {
                            y = y + (h - w / resize.aspect);
                            h = w / resize.aspect;
                        } else {
                            w = h * resize.aspect;
                        }
                    break;
                    case 'sw-resize' :
                        if (resize.aspect > 1) {
                             h = w / resize.aspect;
                        } else {
                            x = x + (w - h * resize.aspect);
                            w = h * resize.aspect;
                        }
                    break;
                    case 'nw-resize' :
                        if (resize.aspect > 1) {
                            y = y + (h - w / resize.aspect);
                            h = w / resize.aspect;
                        } else {
                            x = x + (w - h * resize.aspect);
                            w = h * resize.aspect;
                        }
                    break;
                }
            }

            if (typeof w !== 'undefined') {
                w = (w>1) ? w : 1;
                document.getElementById('info_size_width').value = w;
                document.getElementById('info_size_width_unit').value = 'px';
            }
            if (typeof h !== 'undefined') {
                h = (h>1) ? h : 1;
                document.getElementById('info_size_height').value = h;
                document.getElementById('info_size_height_unit').value = 'px';
            }
            if (typeof x !== 'undefined') {
                document.getElementById('info_position_x').value = x;
                document.getElementById('info_position_x_unit').value = 'px';
            }
            if (typeof y !== 'undefined') {
                document.getElementById('info_position_y').value = y;
                document.getElementById('info_position_y_unit').value = 'px';
            }
            updateLayers();
        }
    });
    
     document.addEventListener('mouseup', function (event) {
        drag.active = false;
        resize.active = false;
        $(document.body).removeClass('resizing-' + resize.type);
        $(document.body).removeClass('moving');
     });
    
    function layerHandleEvent(event) {
        var layer = $(event.target).closest('.layer');
        console.log(layer);
        if (event.type === 'click' && event.target.className === 'remove' && confirm('Remove layer?')) {
            layer.fadeOut(function() { 
                layer.remove();
            });
            document.getElementById('size-helper').style.display = 'none';
            layers.getByCid(layer.attr('data-id')).destroy();
        } else if (event.type === 'mousedown') {
            //alert(event.target.className);
            $('#layers .layer.selected').removeClass('selected');
            layer.addClass('selected');
            selectedLayer = layers.getByCid(layer.attr('data-id'));

            //show size
            // [TODO] Replace with better core typing
            var sizeHelper = document.getElementById('size-helper'),
                size = selectedLayer.attributes.size.split(' '),
                position = (selectedLayer.attributes.position) ? selectedLayer.attributes.position.split(' ') : [0,0];
            sizeHelper.style.display = 'block';
            sizeHelper.style.width = size[0];
            sizeHelper.style.height = size[1];
            sizeHelper.setAttribute('data-layer',layer.attr('data-id'));
            sizeHelper.style.left = parseInt(position[0]) + 'px';
            sizeHelper.style.top = parseInt(position[1]) + 'px';
            sizeHelper.onselectstart = function () { return false; };
            //sizeHelper.style.webkitTransform = 'translate3d(' + parseInt(position[0]) + 'px, ' + parseInt(position[0]) + 'px, 0)';


            // [TODO] Use proper code to get the px/% from the model
            document.getElementById('info_position_x').value = parseInt(position[0]);
            document.getElementById('info_position_y').value = parseInt(position[1]);
            document.getElementById('info_position_x_unit').value = 'px';
            document.getElementById('info_position_y_unit').value = 'px';
            document.getElementById('info_size_width').value = parseInt(size[0]);
            document.getElementById('info_size_height').value = parseInt(size[1]);
            document.getElementById('info_size_width_unit').value = 'px';
            document.getElementById('info_size_height_unit').value = 'px';

            $('#info-panel').unbind();
            $('#info-panel').bind('input', updateLayers);
            $('#info-panel').bind('change', updateLayers);
            
            $(document.body).unbind('keydown');
            $(document.body).bind('keydown', function (e) {
                var x = document.getElementById('info_position_x'),
                    y = document.getElementById('info_position_y');
                if (e.srcElement === document.body) {
                    switch ('' + e.keyCode) {
                    case '37':
                        x.value -= ((e.shiftKey) ? 10 : 1);
                    break;
                    case '38':
                        y.value -= ((e.shiftKey) ? 10 : 1);
                        break;
                    case '39':
                        x.value = ((e.shiftKey) ? 10 : 1) + x.value * 1;
                        break;
                    case '40':
                        y.value = ((e.shiftKey) ? 10 : 1) + y.value * 1;
                        break;
                    }
                    updateLayers();
                }
            });

        } else if (event.type === 'click' && event.target.className === 'enabled') {
            layers.getByCid(layer.attr('data-id')).attributes.enabled = event.target.checked;
            layers.trigger('update');
        }
    }

    layers.bind('update', function (e) {
        document.body.setAttribute('style',this);
        document.getElementById('data').value = this;
    });
    
    layers.bind('remove', function (e) {
        document.body.setAttribute('style',this);
        document.getElementById('data').value = this;
    });
    
    layers.bind('reset', function (e) {
        var template = document.querySelector('#templates>.layer'),
            domLayers = document.getElementById('layers');
            
        layers.trigger('update');
        document.getElementById('size-helper').style.display = 'none';

        domLayers.innerHTML = '';
        layers.forEach(function(e) {
            var newLayer = template.cloneNode(true);
            newLayer.setAttribute('data-id',e.cid);
            newLayer.querySelector('.preview').style.background = e.attributes.image.toString();
            newLayer.querySelector('.info.name').innerHTML = 'Layer ' + e.cid;
            newLayer.querySelector('.info.type').innerHTML = e.attributes.image.name;
            newLayer.querySelector('.info.composite').value = e.attributes.composite;
            newLayer.querySelector('.enabled').checked = e.attributes.enabled;
            newLayer.addEventListener('click', layerHandleEvent, true);
            newLayer.addEventListener('mousedown', layerHandleEvent, true);
            newLayer.querySelector('.info.composite').addEventListener('change', function (event) {
                var layer = event.target.parentNode;
                layers.getByCid(layer.getAttribute('data-id')).attributes.composite = event.target.value;
                layers.trigger('update');
            });
            domLayers.appendChild(newLayer);
        });

        $("#layers").sortable();
        $("#layers").disableSelection();
        $("#layers").unbind("sortupdate");
        $("#layers").bind( "sortupdate", function(event, ui) {
            //console.log(ui);
            var newOrder = [];
            $("#layers .layer").each(function(e, ee) {
                newOrder.push(ee.getAttribute('data-id'));
            });
            layers.reorder(newOrder);
        });
    });
    
    document.getElementById('data').addEventListener('keyup', function (e) {
        layers.parseCSS(event.target.value);
    });
    
    layers.parseCSS(document.getElementById('data').value);

});