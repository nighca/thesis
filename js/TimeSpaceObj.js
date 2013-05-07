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
SpaceZone.prototype.getPos = function(){
    if(this.zones.length < 1) return null;
    var zone = this.zones[0];
    switch(zone.type){
        case 1: return zone.center; break;
        case 2: return zone.points[0]; break;
        case 3: return zone.points[0]; break;
        default: return null; break;
    }
};

var TimeSpaceObj = function () {
    this.name = "";
    this.id = "";
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
    saveToLocal(this.name, this, "TimeSpaceObj");
    return this;
};

TimeSpaceObj.prototype.load = function(name) {
    this.init(loadFromLocal(name, "TimeSpaceObj"));
    return this;
};

TimeSpaceObj.prototype.delete = function() {
    removeFromLocal(this.name, "TimeSpaceObj");
    this = null;
    return this;
};

TimeSpaceObj.prototype.getPos = function() {
    if(!this.spaceZone) return null;
    return this.spaceZone.getPos();
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
            spaceZone.center = new Point(tp.kb, tp.lb);
            //spaceZone.radius = overLays.circle.radius;
            break;
        case 2:
            var tps = overLays.polyline.getPath().b;
            var points = [];
            for(var i=0,l=tps.length;i<l;i++){
                points.push(new Point(tps[i].kb, tps[i].lb));
            }
            spaceZone.points = points;
            //spaceZone.radius = overLays.circle.radius;
            break;
        case 3:
            var tps = overLays.polygon.getPath().b;
            var points = [];
            for(var i=0,l=tps.length;i<l;i++){
                points.push(new Point(tps[i].kb, tps[i].lb));
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

TimeMap.prototype.showObjs = function(objs){
    var timeline = this.timeline;

    var dts = this.datasets;
    if(!dts[datasetId]) return false;
    var dt = dts[datasetId];

    var certainDate;
    var items = [];
    $.each(objs, function(i, obj){
        $.each(obj.timeZone.zones, function(j, timeZone){
            var item = {
                start: timeFormat(timeZone.start),
                end: timeFormat(timeZone.end),
                title: obj.name
            };
            certainDate = (timeZone.start + timeZone.end)/2;
            var pos = obj.getPos();

            if(pos){
                item["point"] = {
                    lat: pos.lat,
                    lon: pos.lng
                }
                items.push(item);
            }
        });
    });

    dt.clear();
    dt.loadItems(items);

    certainDate && timeline.getBand(0).setCenterVisibleDate(new Date(certainDate));
    timeline.layout();
};