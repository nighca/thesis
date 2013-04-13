var spaceZoneTypes = ["Null", "Point", "Line", "Border", "Polygon"];

var Point = function (latitude, longitude) {
	if(typeof(latitude)!=="number" || typeof(longitude)!=="number") return null;
	this.lat = latitude;
	this.lng = longitude;
	return this;
};

var TimeZone = function() {
    this.zones = [];
    if(arguments.length == 1 && isArray(arguments[0])){
        this.zones = arguments[0];
    }else{
        for(var i in arguments){
            this.zones.push(arguments[i]);
        }
    }
};

TimeZone.prototype.add = function(){
    for(var i in arguments){
        this.zones.push(arguments[i]);
    }
};

var SpaceZone = function() {
    this.zones = [];
    if(arguments.length == 1 && isArray(arguments[0])){
        this.zones = arguments[0];
    }else{
        for(var i in arguments){
            this.zones.push(arguments[i]);
        }
    }
};

SpaceZone.prototype.add = function(){
    for(var i in arguments){
        this.zones.push(arguments[i]);
    }
};

var TimeSpaceObj = function () {
	this.name = "";
	this.timeZone = new TimeZone();
	this.spaceZone = new SpaceZone();
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

TimeSpaceObj.prototype.addTimeZone = function() {
    this.timeZone.add.apply(this.timeZone, arguments);
};

TimeSpaceObj.prototype.addSpaceZone = function() {
    this.spaceZone.add.apply(this.spaceZone, arguments);
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
    var spaceZone = {
        type: type
    };
	switch(type){
        case 0:
            return null;
            break;
        case 1:
        	var tp = overLays.circle.center;
            spaceZone.center = new Point(tp.jb, tp.kb);
            spaceZone.radius = overLays.circle.radius;
            break;
        case 2:
        	var tps = overLays.polyline.getPath().b;
        	var points = [];
        	for(var i=0,l=tps.length;i<l;i++){
        		points.push(new Point(tps[i].jb, tps[i].kb));
        	}
            spaceZone.points = points;
            spaceZone.radius = overLays.circle.radius;
            break;
        case 3:
            var tps = overLays.polygon.getPath().b;
        	var points = [];
        	for(var i=0,l=tps.length;i<l;i++){
        		points.push(new Point(tps[i].jb, tps[i].kb));
        	}
            spaceZone.points = points;
            spaceZone.radius = overLays.circle.radius;
            break;
        case 4:
            var tps = overLays.polygon.getPath().b;
        	var points = [];
        	for(var i=0,l=tps.length;i<l;i++){
        		points.push(new Point(tps[i].jb, tps[i].kb));
        	}
            spaceZone.points = points;
            break;
        default:
            return false;
    }
    return spaceZone;
};

var parsePeriod = function(period){
    return period;
};
