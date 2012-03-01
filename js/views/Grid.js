define('views/Grid', ['models/Layers', 'models/GradientLinear', 'models/ColorStops', 'models/ColorStop'], function (Layers, GradientLinear, ColorStops, ColorStop) {
    
    function Grid() {
        this.domElement = document.getElementById('grid');
        this.color = 'rgba(200,200,255,0.6)';
        this.snapto = false;
    }
    
    var grid = {
        getStops : function () {
            return this.stops = this.stops || new ColorStops().add(new ColorStop(this.color + ' -1px')).add(new ColorStop(this.color + ' 0px')).add(new ColorStop('transparent 1px'));
        },
        setData : function (layers) {
            this.layers = layers
        },
        showGrid : function() {
            var grid = new Layers(), self = this;
            this.layers.forEach(function (g) { 
                grid.add({
                    image : new GradientLinear('linear-gradient','90deg', self.getStops()),
                    size : g.getRect().getWidth() + ' ' + g.getRect().getHeight(),
                    position : g.getRect().getLeft() + ' ' + g.getRect().getTop(),
                    enabled : true
                });
                grid.add({
                    image : new GradientLinear('linear-gradient','180deg', self.getStops()),
                    size : g.getRect().getWidth() + ' ' + g.getRect().getHeight(),
                    position : g.getRect().getLeft() + ' ' + g.getRect().getTop(),
                    enabled : true
                });
            });
            this.domElement.setAttribute('style', grid.toString());
        },
        hideGrid : function () {
            this.domElement.setAttribute('style','');
        },
        setColor : function (color) {
           this.color = color;
           this.stops = null;
        },
        hitTest : function (point) {
            var snap = 10;
            if (this.snapto) {
                this.layers.forEach(function (g) {
                    var left = g.getRect().getLeft().getValue(),
                        top = g.getRect().getTop().getValue();
                        //width = g.getRect().getWidth().getValue(),
                        //height = g.getRect().getHeight().getValue();
                    //if (left > 0)
                        point.x = ((Math.abs(point.x + snap) % left) < 10) ? Math.floor((point.x + snap) / left) * left : point.x;
                    //if (top > 0)
                        point.y = ((Math.abs(point.y + snap) % top) < 10) ? Math.floor((point.y + snap) / top) * top : point.y;
                    //if (width)
                    //    point.x = ((Math.abs(point.x + snap) % width) < 10) ? Math.floor((point.x + 0) / width) * width : point.x;
                    //if (height)
                    //    point.y = ((Math.abs(point.y + snap) % height) < 10) ? Math.floor((point.y + 0) / height) * height : point.y;
                });
            }
            return point;
        }
    }
    Grid.prototype = grid
    return Grid;
});
