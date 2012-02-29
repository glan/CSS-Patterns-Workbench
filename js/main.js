require(['jquery', 'cw/builder', 'cw/Layers','cw/GradientLinear','cw/ColorStops','cw/ColorStop', 'js/jquery-ui-1.8.14.custom.min.js'], function($, builder, Layers, GradientLinear, ColorStops, ColorStop) {
 
    var layers = new Layers(), selectedLayer,
        drag = {};

    document.addEventListener('mousedown', function (event) {
        var size;
        if ((event.type === 'mousedown') && (event.target.id === 'size-helper' || event.target.id === 'ants' )) {
            drag.startX = event.x;
            drag.startY = event.y;
            drag.initX = 1 * document.getElementById('info_position_x').value;
            drag.initY = 1 * document.getElementById('info_position_y').value;
            drag.action = 'move';
            $(document.body).addClass('moving');
        } else if ((event.type === 'mousedown') && (event.target.className === 'resize-helper')) {
            //[TODO] better var names
            drag.startX = event.x;
            drag.startY = event.y;
            drag.initW = 1 * document.getElementById('info_size_width').value;
            drag.initH = 1 * document.getElementById('info_size_height').value;
            drag.initX = 1 * document.getElementById('info_position_x').value;
            drag.initY = 1 * document.getElementById('info_position_y').value;
            drag.action = 'resize';

            //[TODO] layer should have an assessor for getting the aspect
            size = selectedLayer.attributes.size.split(' ');
            drag.aspect = parseInt(size[0]) / parseInt(size[1]);
            drag.type = event.target.getAttribute('data-type');

            $(document.body).addClass('resizing-' + drag.type);
        }
    });
    
    function updateLayers(data) {
        var sizeHelper = document.getElementById('size-helper'), x, y, h, w;

        data = data || {}

        if (typeof data.w !== 'undefined') {
            w = Math.round(data.w);
            document.getElementById('info_size_width').value = w;
            document.getElementById('info_size_width_unit').value = 'px';
            w += 'px';
        } else {
            w = document.getElementById('info_size_width').value + document.getElementById('info_size_width_unit').value;
        }

        if (typeof data.h !== 'undefined') {
            h = Math.round(data.h);
            document.getElementById('info_size_height').value = h;
            document.getElementById('info_size_height_unit').value = 'px';
            h += 'px';
        } else {
            h = document.getElementById('info_size_height').value + document.getElementById('info_size_height_unit').value;
        }

        if (typeof data.x !== 'undefined') {
            x = Math.round(data.x);
            document.getElementById('info_position_x').value = x;
            document.getElementById('info_position_x_unit').value = 'px';
            x += 'px';
        } else {
            x = document.getElementById('info_position_x').value + document.getElementById('info_position_x_unit').value;
        }

        if (typeof data.y !== 'undefined') {
            y = Math.round(data.y);
            document.getElementById('info_position_y').value = y;
            document.getElementById('info_position_y_unit').value = 'px';
            y += 'px';
        } else {
            y = document.getElementById('info_position_y').value + document.getElementById('info_position_y_unit').value;
        }

        //[TODO] These should be setters
        selectedLayer.attributes.position =  x + ' ' + y;
        selectedLayer.attributes.size = w + ' ' + h;

        sizeHelper.style.left = x;
        sizeHelper.style.top = y;
        sizeHelper.style.width = w;
        sizeHelper.style.height = h;

        layers.trigger('update');
    }

    document.addEventListener('mousemove', function (event) {
        var resizeHelper, sizeHelper, x, y, w, h, dx, dy, checkHeight = false, checkWidth = false;
        if (event.type === 'mousemove' && drag.action === 'move') {
            dx = event.x - drag.startX;
            dy = event.y - drag.startY;
            x = drag.initX + dx;
            y = drag.initY + dy;
        } else if (event.type === 'mousemove' && drag.action === 'resize') {
            dx = event.x - drag.startX;
            dy = event.y - drag.startY;
            w = drag.initW;
            h = drag.initH;

            switch (drag.type) {
                case 'se-resize' :
                    w = w + dx;
                    h = h + dy;
                break;
                case 'e-resize' :
                    w = w + dx
                break;
                case 's-resize' :
                    h = h + dy;
                break;
                case 'sw-resize' :
                    h = h + dy;
                    checkWidth = true;
                break;
                case 'ne-resize' :
                    w = w + dx;
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
                h = h - dy;
                if (h<1) {
                    y = drag.initY + dy + h;
                    h = 1;
                } else {
                    y = drag.initY + dy;
                }
            }
            if (checkWidth) {
                w = w - dx;
                if (w<1) {
                    x = drag.initX + dx + w;
                    w = 1;
                } else {
                    x = drag.initX + dx;
                }
            }

            if (event.shiftKey)
            {
                switch (drag.type) {
                    case 'se-resize' :
                        if (drag.aspect > 1) {
                            h = w / drag.aspect;
                        } else {
                            w = h * drag.aspect;
                        }
                    break;
                    case 'e-resize' :
                        h = w / drag.aspect;
                    break;
                    case 's-resize' :
                        w = h * drag.aspect;
                    break;
                    case 'n-resize' :
                        w = h * drag.aspect;
                    break;
                    case 'w-resize' :
                        h = w / drag.aspect;
                    break;
                    case 'ne-resize' :
                        if (drag.aspect > 1) {
                            y = y + (h - w / drag.aspect);
                            h = w / drag.aspect;
                        } else {
                            w = h * drag.aspect;
                        }
                    break;
                    case 'sw-resize' :
                        if (drag.aspect > 1) {
                             h = w / drag.aspect;
                        } else {
                            x = x + (w - h * drag.aspect);
                            w = h * drag.aspect;
                        }
                    break;
                    case 'nw-resize' :
                        if (drag.aspect > 1) {
                            y = y + (h - w / drag.aspect);
                            h = w / drag.aspect;
                        } else {
                            x = x + (w - h * drag.aspect);
                            w = h * drag.aspect;
                        }
                    break;
                }
            }
            w = (w>1) ? w : 1;
            h = (h>1) ? h : 1;
        }

        if (event.type === 'mousemove' && drag.action) {
            updateLayers({x:x,y:y,w:w,h:h});
        }
    });
    
     document.addEventListener('mouseup', function (event) {
        drag.action = false;
        $(document.body).removeClass('resizing-' + drag.type);
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
        document.getElementById('canvas').setAttribute('style',this);
        document.getElementById('data').value = this;
        
        if (document.getElementById('update-grid').checked) {
            updateGrid();
        }
    });
    
    function updateGrid () {
        var grids, grid, color;
        if (document.getElementById('show-grid').checked) {
            grids = layers.getGridData();
            grid = new Layers();
            color = document.getElementById('grid-color').value;
            grids.forEach(function (g) { 
                var stops = new ColorStops().add(new ColorStop(color + ' -1px')).add(new ColorStop(color + ' 0px')).add(new ColorStop('transparent 1px'));
                grid.add({
                    image : new GradientLinear('linear-gradient','90deg',stops),
                    size : g.w + ' ' + g.h,
                    position : g.x + ' ' + g.y,
                    enabled : true
                });
                grid.add({
                    image : new GradientLinear('linear-gradient','180deg',stops),
                    size : g.w + ' ' + g.h,
                    position : g.x + ' ' + g.y,
                    enabled : true
                });
            });
            document.getElementById('grid').setAttribute('style', grid.toString());
        } else
            document.getElementById('grid').setAttribute('style','');
    }

    layers.bind('remove', function (e) {
        layers.trigger('update');
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

        $("#layers").sortable({cursor:'-webkit-grabbing'});
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

        document.getElementById('background-color').value = layers.backgroundColor;
        updateGrid();
    });
    
    document.getElementById('grid-options').addEventListener('change', function (event) {
        updateGrid();
    });
    
    document.getElementById('background-color').addEventListener('change', function (event) {
        layers.backgroundColor = document.getElementById('background-color').value;
        layers.trigger('update');
    });

    document.getElementById('data').addEventListener('keyup', function (e) {
        layers.parseCSS(event.target.value);
    });

    layers.parseCSS(document.getElementById('data').value);

});