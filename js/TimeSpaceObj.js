var Point = function (latitude, longitude) {
    if(typeof(latitude)!=="number" || typeof(longitude)!=="number") return null;
    this.lat = latitude;
    this.lng = longitude;
    return this;
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

TimeZone.prototype.add = function(zone){
    var zones = this.zones;
    for(var j in zones){
        if(zones[j].start == zone.start && zones[j].end == zone.end){
            return zones[j];
        }
    }
    zones.push(zone);
    if(!zone.spaceZone) zone.spaceZone = new SpaceZone();
    return zone;
};

var TimeSpaceObj = function () {
    this.name = "";
    this.id = "";
    this.type="";
    this.timeZone = new TimeZone();
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
    return this.timeZone.add.apply(this.timeZone, arguments);
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

var parseOverLay = function(type, overLays){
    var spaceZone = {
        type: type
    };
    switch(type){
        case 0:
            return null;
            break;
        case 1:
            var tp = overLays.circle.getCenter();
            spaceZone.center = new Point(tp.lat(), tp.lng());
            //spaceZone.radius = overLays.circle.radius;
            break;
        case 2:
            var tps = overLays.polyline.getPath().getArray();
            var points = [];
            for(var i=0,l=tps.length;i<l;i++){
                points.push(new Point(tps[i].lat(), tps[i].lng()));
            }
            spaceZone.points = points;
            //spaceZone.radius = overLays.circle.radius;
            break;
        case 3:
            var tps = overLays.polygon.getPath().getArray();
            var points = [];
            for(var i=0,l=tps.length;i<l;i++){
                points.push(new Point(tps[i].lat(), tps[i].lng()));
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
                title: obj.name,
                type: obj.type,
                thumbnail: obj.thumbnail,
                description: obj.description
            };
            certainDate = (timeZone.start + timeZone.start)/2;
            var pos = timeZone.spaceZone.getPos();

            if(pos){
                item["point"] = {
                    lat: pos.lat,
                    lon: pos.lng
                };
                items.push(item);
            }
        });
    });

    dt.clear();
    dt.loadItems(items, function(item){
        if(TimeMap.themes[item.type]){
            log(item);//-----------------------
            if(!item.options){
                item.options = {};
            }
            item.options.theme = item.type;
            item.options.thumbnail = item.thumbnail || "/hzm/sites/default/files/logo2.png";
            item.options.description = item.description || "无简介";
            item.options.infoTemplate = '<div class="info-window"><img class="left thumbnail" src="{{thumbnail}}"><h4>{{title}}</h4><p>{{description}}</p></div>';
        }
        return item;
    });

    certainDate && timeline.getBand(0).setCenterVisibleDate(new Date(certainDate));
    timeline.layout();
};
