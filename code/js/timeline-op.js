var zoom = function (timeline, bandIndex, InOut) {
	try{
		if(typeof InOut !== "boolean" || typeof timeline !== "object" || typeof bandIndex !== "number"){
			throw new Error("Wrong arguments for zoom!")
		}
	} catch (e) {
		alert(e)
	}

	var Eband = timeline.getBand(bandIndex)._div;

	var Etimeline = timeline._containerDiv;
	var x = -parseInt(Eband.style.left) + $(Etimeline).width()/2;
	var y = 0;

	return timeline.zoom(InOut, x, y, Eband);
};

var zoomIn = function(timeline, bandIndex){
	return zoom(timeline, bandIndex, true);
};

var zoomOut = function(timeline, bandIndex){
	return zoom(timeline, bandIndex, false);
};

function enablePeriodSelect(timeline, afterSelect){
  	log("Period select");//--------------------
	var period = {};
  	var listeners = [];

  	var dates = [];
  	var startPos = 0;
    var band = tm.timeline._bands[0];
    var bandDIV = $(band._div);

    var rectangle;

    var renderRec = function(event) {
        var A = SimileAjax.DOM.getEventRelativeCoordinates(event, this);
        var s = startPos;
        var w0 = parseInt(rectangle.css("width"));
        var e = A.x;
        var w = e - s;
        if(w>=0){
        	rectangle.css({
        		left: s,
        		width: w
        	});
        }else{
        	rectangle.css({
        		left: e,
        		width: -w
        	});
        }
    };

    dates.add = function(date, pos){
    	this.push(date);

    	var temp;

    	if(this.length==1){
    		rectangle = $('<div id="time-period-rec" class="time-period-rec"></div>');
    		startPos = pos.x;
    		rectangle.css("left",startPos).appendTo(bandDIV);

    		bandDIV.on("mousemove", renderRec);
		    temp = listeners.push({
		    	obj: bandDIV,
		    	event: "mousemove",
		    	handler: renderRec
		    }) - 1;
    	}

        if(this.length>=2){
        	bandDIV.off("mousemove", renderRec);
        	listeners.splice(temp, 1);
        	afterSelect && afterSelect();
        }

        if(this.length>2){
        	this.splice(0,1);
        }
    };

    var getDate = function(event) {
        var A = SimileAjax.DOM.getEventRelativeCoordinates(event, this);
        var date = band._ether.pixelOffsetToDate(A.x + band._viewOffset).valueOf();
        qqq = date;//-------------------------------

        dates.add(date, A);
    };

    bandDIV.on("click", getDate);
    listeners.push({
    	obj: bandDIV,
    	event: "click",
    	handler: getDate
    });

	return {
	    getPeriod: function(){
	    	period["start"] = dates[0];
	    	period["end"] = dates[1];

	    	if(dates[0]>dates[1]){
	    		period["start"] = dates[1];
	    		period["end"] = dates[0];
	    	}

	      	return period;
	    },
	    /*getListeners: function(){
	      	return listeners;
	    },*/
	    clean: function(){
			$.each(listeners, function(i, listener){
				listener["obj"].off(listener.event, listener.handler);
			});

	    	rectangle.remove();
	    	while(dates.pop()>1);

	    	return true;
	    }
	};
}

function disablePeriodSelect(e){
	e && e.clean();

	return null;
}

function showTimeZone(timeline, zone, afterShow){
    var band = tm.timeline._bands[0];
    var bandDIV = $(band._div);
    var start = band._ether.dateToPixelOffset(zone.start);
    var end = band._ether.dateToPixelOffset(zone.end);
    log(start, end);//--------------------
    var width = end - start;
    var rectangle = $('<div id="time-period-rec" class="time-period-rec"></div>');
    rectangle.css({
        left: start,
        width: width
    }).appendTo(bandDIV);

  
    afterShow && afterShow();
}

function showTimeZones(timeline, zones, afterShow){
    var l = zones.length;
    $.each(zones, function(i,zone){
        if(i<l-1){
            showTimeZone(map, zone);
        }else{
            showTimeZone(map, zone, afterShow);
        }
    });
}