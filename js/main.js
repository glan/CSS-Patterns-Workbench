require(['jquery', 'cw/builder', 'cw/Layers', 'js/jquery-ui-1.8.14.custom.min.js'], function($, builder, Layers) {
 
    var layers = new Layers(),
        drag = {}, resize = {};

    document.addEventListener('mousedown', function (event) {
        if ((event.type === 'mousedown') && (event.target.id === 'size-helper')) {
            drag.offsetX = event.offsetX;
            drag.offsetY = event.offsetY;
            drag.active = true;
            $(document.body).addClass('moving');
        } else if ((event.type === 'mousedown') && (event.target.id === 'resize-helper')) {
            resize.offsetX = event.offsetX + parseInt(event.target.parentNode.style.left) - 8;
            resize.offsetY = event.offsetY + parseInt(event.target.parentNode.style.top) - 8;
            resize.active = true;
            $(document.body).addClass('resizing');
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
        var resizeHelper, sizeHelper, x, y;
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
            // [TODO] Holding the shift key should lock the aspect ratio
            x = event.x - resize.offsetX;
            y= event.y - resize.offsetY;
            x = (x>0) ? x : 0;
            y = (y>0) ? y : 0;
 
            document.getElementById('info_size_width').value = x;
            document.getElementById('info_size_height').value = y;
            document.getElementById('info_size_width_unit').value = 'px';
            document.getElementById('info_size_height_unit').value = 'px';
            //var layer = layers.getByCid(sizeHelper.getAttribute('data-layer'));
            //layer.attributes.size = (event.x - resize.offsetX) + 'px ' + (event.y - resize.offsetY) + 'px';
            //;
            updateLayers();
        }
    });
    
     document.addEventListener('mouseup', function (event) {
        drag.active = false;
        resize.active = false;
        $(document.body).removeClass('moving').removeClass('resizing');
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

            //show size
            // [TODO] Replace with better core typing
            var sizeHelper = document.getElementById('size-helper'),
                size = layers.getByCid(layer.attr('data-id')).attributes.size.split(' '),
                position = (layers.getByCid(layer.attr('data-id')).attributes.position) ? layers.getByCid(layer.attr('data-id')).attributes.position.split(' ') : [0,0];
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