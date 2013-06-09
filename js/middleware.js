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

var getPeriods = function(callback, fail){
    getData("php/get.php?limit=period", function(ret){
        if(ret){
            for (var i = ret.length - 1; i >= 0; i--) {
                ret[i].start = ret[i].begin;
            };
        }
        callback(ret);
    }, fail);
};

var getZones = function(callback, fail){
    getData("php/get.php?limit=zone", function(ret){
        if(ret){
            for (var i = ret.length - 1; i >= 0; i--) {
                ret[i].space = parseSpace(JSON.parse(ret[i].space));
            };
        }
        callback(ret);
    }, fail);
};

var savePeriod = function(data, callback, fail){
    data.action = "create_period";
    data.begin = timeFormat(data.start);
    data.end = timeFormat(data.end);
    postData(data, "php/op.php", callback, fail);
};

var saveZone = function(data, callback, fail){
    data.action = "create_zone";
    data.space = spaceZoneToWKT(data.space);
    postData(data, "php/op.php", callback, fail);
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
            spaceZone.center = new Point(tp[1], tp[0]);
            break;
        case 2:
            var tps = space.coordinates;
            var points = [];
            for(var i=0,l=tps.length;i<l;i++){
                points.push(new Point(tps[i][1], tps[i][0]));
            }
            spaceZone.points = points;
            break;
        case 3:
            var tps = space.coordinates[0];
            var points = [];
            for(var i=0,l=tps.length;i<l-1;i++){
                points.push(new Point(tps[i][1], tps[i][0]));
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
        if(item.thumbnail) item.thumbnail = item.thumbnail.replace("public://", "/hzm/sites/default/files/")

        var obj = null;
        var id = item.id;
        for (var j = objList.length - 1; j >= 0; j--) {
            if(objList[j].id == id) obj = objList[j];
        };

        if(!obj){
            obj = new TimeSpaceObj();
            obj.init(item);
            objList.push(obj);
        }

        var timeZone = obj.addTimeZone({
            start: parseInt(item.begin)*1000,
            end: parseInt(item.end)*1000
        });
        timeZone.spaceZone.add(parseSpace(JSON.parse(item.space)));
    };
};

var spaceZoneToWKT = function(spaceZone, withRadius){
	var wktStr;
    switch(spaceZone.type){
    	case 0: break;
    	case 1: 
    		wktStr = "POINT (" + spaceZone.center.lng + " " + spaceZone.center.lat + ")";
    		break;
    	case 2:
    		wktStr = "LINESTRING (";
    		for (var i = 0, l = spaceZone.points.length; i < l; i++) {
    			var point = spaceZone.points[i];
    			wktStr += point.lng + " " + point.lat;
    			if(i!=l-1) wktStr += ",";
    		}
    		wktStr += ")";
    		break;
    	case 3:
            if(!withRadius){
        		wktStr = "POLYGON ((";
        		for (var i = 0, l = spaceZone.points.length; i < l; i++) {
        			var point = spaceZone.points[i];
        			wktStr += point.lng + " " + point.lat;
        			wktStr += ",";
        		}
        		var begin = spaceZone.points[0];
        		wktStr += begin.lng + " " + begin.lat;
        		wktStr += "))";
            }else{
                wktStr = "LINESTRING (";
                for (var i = 0, l = spaceZone.points.length; i < l; i++) {
                    var point = spaceZone.points[i];
                    wktStr += point.lng + " " + point.lat;
                    wktStr += ",";
                }
                var begin = spaceZone.points[0];
                wktStr += begin.lng + " " + begin.lat;
                wktStr += ")";
            }
    		break;
    }

    return wktStr;
};

TimeSpaceObj.prototype.save = function(callback, fail) {
    //saveToLocal(this.name, this, "TimeSpaceObj");

    var objId = this.id;

    var timeZones = this.timeZone.zones;

    for (var i = timeZones.length - 1; i >= 0; i--) {
    	var timeZone = timeZones[i];
    	var begin = timeFormat(timeZone.start);
    	var end = timeFormat(timeZone.end);
        var spaceZones = timeZone.spaceZone.zones;

    	for (var j = spaceZones.length - 1; j >= 0; j--) {
    		var spaceZone = spaceZones[j];
    		var space = spaceZoneToWKT(spaceZone);
    		var type = spaceZoneTypes[spaceZone.type];

    		postData({
		    	"action": "insert",
		    	"objId": objId,
		    	"begin": begin,
		    	"end": end,
		    	"description": "Input by time_space v2.",
		    	"type": type,
		    	"space": space
		    }, "php/op.php", function(res){
                callback && callback();
		    }, function(err){
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

TimeSpaceObj.prototype.delete = function(callback, fail) {
    postData({
        "action":"delete",
        "objId":this.id
    },"php/op.php", function(res){
        callback && callback();
    }, function(err){
        fail && fail();
    });
    
    return this;
};
