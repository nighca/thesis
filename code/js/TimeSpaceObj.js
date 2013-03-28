var timeSpaceObjTypes = ["Null", "Point", "Line", "Border", "Polygon"];

var Point = function (latitude, longitude) {
	if(typeof(latitude)!=="number" || typeof(longitude)!=="number") return null;
	this.lat = latitude;
	this.lng = longitude;
	return this;
};

var TimeSpaceObj = function () {
	this.name = "";
	this.type = 0;
	this.timeZone = {};
	this.spaceZone = {};
	this.tags = [];
};

TimeSpaceObj.prototype.init = function(obj) {
	for(var name in obj){
		if(typeof(obj[name]) !== "function"){
			this[name] = obj[name];
		}
	}
	return true;
};

TimeSpaceObj.prototype.save = function() {
	localStorage[this.name] = JSON.stringify(this);
	return true;
};

TimeSpaceObj.prototype.load = function(name) {
	this.init(JSON.parse(localStorage[name]));
	return true;
};

var parseOverLay = function(type, overLays){
	switch(type){
        case 0:
            return null;
            break;
        case 1:
        	var tp = overLays.point.position;
            return {
            	point: new Point(tp.jb, tp.kb)
            };
            break;
        case 2:
        	var tps = overLays.polyline.getPath().b;
        	var points = [];
        	for(var i=0,l=tps.length;i<l;i++){
        		points.push(new Point(tps[i].jb, tps[i].kb));
        	}
            return {
            	points: points
            };
            break;
        case 3:
            var tps = overLays.polygon.getPath().b;
        	var points = [];
        	for(var i=0,l=tps.length;i<l;i++){
        		points.push(new Point(tps[i].jb, tps[i].kb));
        	}
            return {
            	points: points
            };
            break;
        case 4:
            var tps = overLays.polygon.getPath().b;
        	var points = [];
        	for(var i=0,l=tps.length;i<l;i++){
        		points.push(new Point(tps[i].jb, tps[i].kb));
        	}
            return {
            	points: points
            };
            break;
        default:
            return false;
    }
};