require(['jquery', 'cw/builder', 'cw/Layers', 'js/jquery-ui-1.8.14.custom.min.js'], function($, builder, Layers) {
   // var myPattern = builder.parseCSS('background-color: rgb(236,217,182);background-size: 337px 337px;background-position: -205px -205px,                     -229px -229px,                     -205px -157px,                     -229px -181px,                     -205px -109px,                     -229px -133px,                                          -157px -205px,                     -181px -229px,                     -157px -157px,                     -181px -181px,                     -157px -109px,                     -181px -133px,                                          -109px -205px,                     -133px -229px,                     -109px -157px,                     -133px -181px,                     -109px -109px,                     -133px -133px,                     0 0, 0 0, 0 0, 0 0;background-image:    -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(135deg, transparent 0, transparent 459px, rgb(58,47,49) 459px, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg,transparent, transparent 0px, transparent 1px, rgba(236,217,182,0.6) 1px, rgba(236,217,182,0.6) 2px),   -webkit-repeating-linear-gradient(transparent, transparent 18px,     rgba(0,0,0,0.4) 18px,     rgba(0,0,0,0.4) 32px,     transparent 32px,     transparent 108px,     rgba(0,0,0,.4) 108px,     rgba(0,0,0,.4) 132px,     rgba(255,255,255,.5) 132px,     rgba(255,255,255,.5) 156px,     rgba(0,0,0,.4) 156px,     rgba(0,0,0,.4) 180px,     rgba(255,255,255,.5) 180px,     rgba(255,255,255,.5) 204px,     rgba(0,0,0,.4) 204px,     rgba(0,0,0,.4) 228px,    transparent 228px,     transparent 304px,    rgba(0,0,0,0.4) 304px,     rgba(0,0,0,0.4) 318px,    transparent 318px,    transparent 336px),    -webkit-repeating-linear-gradient(180deg, transparent, transparent 18px,     rgba(0,0,0,0.4) 18px,     rgba(0,0,0,0.4) 32px,     transparent 32px,     transparent 108px,     rgba(0,0,0,.4) 108px,     rgba(0,0,0,.4) 132px,     rgba(255,255,255,.5) 132px,     rgba(255,255,255,.5) 156px,     rgba(0,0,0,.4) 156px,     rgba(0,0,0,.4) 180px,     rgba(255,255,255,.5) 180px,     rgba(255,255,255,.5) 204px,     rgba(0,0,0,.4) 204px,     rgba(0,0,0,.4) 228px,    transparent 228px,     transparent 304px,    rgba(0,0,0,0.4) 304px,     rgba(0,0,0,0.4) 318px,    transparent 318px,    transparent 336px);');
   // var myPattern = builder.parseCSS('background-image: -webkit-repeating-linear-gradient( top left,   green 0%,  brown 100%, rgba(20,20,20,0.5) 50%), -webkit-repeating-linear-gradient( 25deg,   transparent 0,  transparent 459px, rgb(58,47,49) 459px, #010 50%, rgb(58,47,49) 475px),   -webkit-repeating-linear-gradient(-45deg, transparent 0  , transparent 459px   );');
    //console.log(myPattern.toCSS());
    //builder.parseCSS('background:linear-gradient(-45deg, #708090 22px, #d9ecff 22px, #d9ecff 24px, transparent 24px, transparent 67px, #d9ecff 67px, #d9ecff 69px, transparent 69px),linear-gradient(225deg, #708090 22px, #d9ecff 22px, #d9ecff 24px, transparent 24px, transparent 67px, #d9ecff 67px, #d9ecff 69px, transparent 69px) 0 64px;background-color:#708090;background-size: 64px 128px');
    //builder.parseCSS('background:linear-gradient(45deg, #92baac 45px, transparent 45px),linear-gradient(45deg, #92baac 45px, transparent 45px)64px 64px,linear-gradient(225deg, transparent 46px, #e1ebbd 46px, #e1ebbd 91px, transparent 91px),linear-gradient(-45deg, #92baac 23px, transparent 23px, transparent 68px,#92baac 68px,#92baac 113px,transparent 113px,transparent 158px,#92baac 158px);background-color:#e1ebbd;background-size: 128px 128px');
    //builder.parseCSS('background:  linear-gradient(63deg, #151515 5px, transparent 5px) 0 5px,  linear-gradient(243deg, #151515 5px, transparent 5px) 10px 0px,  linear-gradient(63deg, #222 5px, transparent 5px) 0px 10px,  linear-gradient(243deg, #222 5px, transparent 5px) 10px 5px,linear-gradient(0deg, #1b1b1b 10px, transparent 10px),linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424);background-color: #131313;background-size: 20px 20px;');

    var layers = new Layers(),
        drag = {}, resize = {};
    
    document.addEventListener('mousedown', function (event) {
        if ((event.type === 'mousedown') && (event.target.id === 'size-helper')) {
            drag.offsetX = event.offsetX;
            drag.offsetY = event.offsetY;
            drag.active = true;
            $(document.body).addClass('moving');
        } else if ((event.type === 'mousedown') && (event.target.id === 'resize-helper')) {
            resize.offsetX = event.offsetX + parseInt(event.target.parentNode.style.left) - 4;
            resize.offsetY = event.offsetY + parseInt(event.target.parentNode.style.top) - 4;
            resize.active = true;
            $(document.body).addClass('resizing');
        }
    });
    
    document.addEventListener('mousemove', function (event) {
       //console.log(drag.active);
        var resizeHelper, sizeHelper;
        if ((event.type === 'mousemove' && drag.active) ) {
            sizeHelper = document.getElementById('size-helper');
            //sizeHelper.style.webkitTransform = 'translate3d(' + (event.x - drag.offsetX) + 'px,' + (event.y - drag.offsetY) + 'px,0)';
            sizeHelper.style.left = parseInt(event.x - drag.offsetX) - 2 + 'px';
            sizeHelper.style.top = parseInt(event.y - drag.offsetY) - 2 + 'px';
            var layer = layers.getByCid(sizeHelper.getAttribute('data-layer'));
            layer.attributes.position = (event.x - drag.offsetX) + 'px ' + (event.y - drag.offsetY) + 'px';
            layers.trigger('update');
        } else if ((event.type === 'mousemove' && resize.active) ) {
            // [TODO] Holding the shift key should lock the aspect ratio
            sizeHelper = document.getElementById('size-helper');
            sizeHelper.style.width = (event.x - resize.offsetX) + 'px';
            sizeHelper.style.height = (event.y - resize.offsetY) + 'px';
            var layer = layers.getByCid(sizeHelper.getAttribute('data-layer'));
            layer.attributes.size = (event.x - resize.offsetX) + 'px ' + (event.y - resize.offsetY) + 'px';
            layers.trigger('update');
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
                position = layers.getByCid(layer.attr('data-id')).attributes.position.split(' ');
            sizeHelper.style.display = 'block';
            sizeHelper.style.width = size[0];
            sizeHelper.style.height = size[1];
            sizeHelper.setAttribute('data-layer',layer.attr('data-id'));
            sizeHelper.style.left = parseInt(position[0]) - 2 + 'px';
            sizeHelper.style.top = parseInt(position[1]) - 2 + 'px';
            sizeHelper.onselectstart = function () { return false; };
            //sizeHelper.style.webkitTransform = 'translate3d(' + parseInt(position[0]) + 'px, ' + parseInt(position[0]) + 'px, 0)';
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