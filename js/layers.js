GW = {};

GW.point = function(x, y) {
	this.x = x;
	this.y = y;
}

GW.point.prototype = {
	toString : function() {
		return ((this.x) ? this.x : '') + ((this.x && this.y) ? ' ' + this.y : '');
	}
}

GW.angle = function(angle) {
	this.angle = angle;
	this.units = 'deg';
}

GW.angle.prototype = {
	toString : function() {
		return this.angle + this.units;
	}
}

GW.stop = function(color,percentage,length) {
	this.color = color;
	this.percentage = percentage;
	this.length = length;
}

GW.stop.prototype = {
	toString : function() {
		return '' + this.color + ((this.percentage || this.length) ? ' ' + ((this.percentage) ? this.percentage + '%' : this.length + 'px') : '');
	}
}

GW.gradient = function() {
}

GW.gradient.prototype = {
	toString : function() {
	   this.sortStops();
		var i = this.stops.length, 
			output = '-webkit-' + this.type + '(' 
		+ ((this.orientation) ? this.orientation.toString() + ',' : '')
		+ ((this.shape) ? this.shape : '') + ((this.shape && this.size) ? ' ' : '') + ((this.size) ? this.size : '') + ((this.shape || this.size) ? ',' : '');

		while(i--) {
			output += this.stops[i].toString() + ((i>0) ? ',' : '');
		}
		output+= ')';
		return output;
	},
	
	addStop : function(stop) {
		this.stops.push(stop);
		return this;
	},
	
	sortStops : function() {
	   this.stops.sort(function(a,b) {
	       return (a.percentage == b.percentage && a.length == b.length) ? 0 : (a.percentage < b.percentage || a.length < b.length) ? 1 : -1;
	   });
	   return this;
	}
}

GW.linearGradient = function(orientation) {
	this.type = 'repeating-linear-gradient';
	this.orientation = orientation;
	this.stops = [];
}

GW.linearGradient.prototype = GW.gradient.prototype;

GW.radialGradient = function(orientation, shape, size) {
	this.type  = 'repeating-radial-gradient';
	this.orientation = orientation;
	this.shape = shape;
	this.size  = size;
	this.stops = [];
}

GW.radialGradient.prototype = GW.gradient.prototype;





GW.layer = function(gradient, size, position) {
	this.gradient = gradient;
	this.size = (size) ? size : new GW.point();
	this.position = (position) ? position : new GW.point();
}

GW.layer.prototype = {
	setSize : function(x, y) {
	   this.size = new GW.point(x, y);
	},
	setPosition : function(x, y) {
	   this.position = new GW.point(x, y);
	}
}


GW.layers = function() {

}

GW.layers.prototype = Array.prototype;


GW.layers.prototype.getPosition = function() {
	var i = this.length,
	output = '';
	while(i--) {
		output += this[i].position.toString() + ((i>0) ? ',' : '');
	}
	return output;
}

GW.layers.prototype.getSize = function() {
	var i = this.length,
	output = '';
	while(i--) {
		output+=this[i].size.toString() + ((i>0) ? ',' : '');
	};
	return output;
}

GW.layers.prototype.getImage = function() {
	var i = this.length,
	output = '';
	while(i--) {
		output+=this[i].gradient.toString() + ((i>0) ? ',' : '');
	};
	return output;
}

GW.layers.prototype.convertToCSS = function() {
	return 'background-position:'+this.getPosition() + ';background-size:' + this.getSize() + ';background-image:'+this.getImage() +';';
}
