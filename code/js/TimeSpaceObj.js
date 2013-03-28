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