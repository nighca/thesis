var objList = [];

var dataset = {
    id: datasetId,
    title: "TimeSpaceObjs",
    theme: "orange",
    type: "basic",
    options: {
        items: []
    }
};

var parseSpace = function(space){
    var types = {
        "Point" : 1,
        "LineString" : 2,
        "Polygon" : 3
    };
    var spaceZone = {
        type: types[space.type]
    };
    switch(spaceZone.type){
        case 0:
            return null;
            break;
        case 1:
            var tp = space.coordinates;
            spaceZone.center = new Point(tp[0], tp[1]);
            //spaceZone.radius = overLays.circle.radius;
            break;
        case 2:
            var tps = space.coordinates;
            var points = [];
            for(var i=0,l=tps.length;i<l;i++){
                points.push(new Point(tps[i][0], tps[i][1]));
            }
            spaceZone.points = points;
            //spaceZone.radius = overLays.circle.radius;
            break;
        case 3:
            var tps = space.coordinates[0];
            var points = [];
            for(var i=0,l=tps.length;i<l-1;i++){
                points.push(new Point(tps[i][0], tps[i][1]));
            }
            spaceZone.points = points;
            break;
        default:
            return null;
    }
    return spaceZone;
};

var setData = function(items){
    if(!items) return null;

    objList = [];

    for (var i = 0, l = items.length; i<l; i++) {
        var item = items[i];
        var obj = null;
        var id = item.id;
        for (var j = objList.length - 1; j >= 0; j--) {
            if(objList[j].id == id) obj = objList[j];
        };

        if(!obj){
            obj = new TimeSpaceObj();
            obj.init({
                id: id,
                name: item.title
            });
            objList.push(obj);
        }

        obj.addTimeZone({
            start: parseInt(item.begin)*1000,
            end: parseInt(item.end)*1000
        });
        obj.addSpaceZone(parseSpace(JSON.parse(item.space)));
    };
};

var spaceZoneToWKT = function(spaceZone){
	var wktStr;
    switch(spaceZone.type){
    	case 0: break;
    	case 1: 
    		wktStr = "POINT (" + spaceZone.center.lat + " " + spaceZone.center.lng + ")";
    		break;
    	case 2:
    		wktStr = "LINESTRING (";
    		for (var i = 0, l = spaceZone.points.length; i < l; i++) {
    			var point = spaceZone.points[i];
    			wktStr += point.lat + " " + point.lng;
    			if(i!=l-1) wktStr += ",";
    		}
    		wktStr += ")";
    		break;
    	case 3:
    		wktStr = "POLYGON ((";
    		for (var i = 0, l = spaceZone.points.length; i < l; i++) {
    			var point = spaceZone.points[i];
    			wktStr += point.lat + " " + point.lng;
    			wktStr += ",";
    		}
    		var begin = spaceZone.points[0];
    		wktStr += begin.lat + " " + begin.lng;
    		wktStr += "))";
    		break;
    }

    return wktStr;
};

TimeSpaceObj.prototype.save = function(callback, fail) {
    //saveToLocal(this.name, this, "TimeSpaceObj");

    var objId = this.id;

    var timeZones = this.timeZone.zones;
    var spaceZones = this.spaceZone.zones;

    for (var i = timeZones.length - 1; i >= 0; i--) {
    	var timeZone = timeZones[i];
    	var begin = timeFormat(timeZone.start);
    	var end = timeFormat(timeZone.end);
    	for (var j = spaceZones.length - 1; j >= 0; j--) {
    		var spaceZone = spaceZones[j];
    		var space = spaceZoneToWKT(spaceZone);
    		var type = spaceZoneTypes[spaceZone.type];

    		postData({
		    	"action": "insertTimeSpace",
		    	"objId": objId,
		    	"begin": begin,
		    	"end": end,
		    	"description": "haha, test",
		    	"type": type,
		    	"space": space
		    }, "php/op.php", function(res){
		    	log(res);
                callback && callback();
		    }, function(err){
		    	log(err);
                fail && fail();
		    });
    	};
    };

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