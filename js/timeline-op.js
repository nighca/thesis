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

    var temp;
    dates.add = function(date, pos){
        var l = this.length;
        log(l, this);//------------------
    	if(l==0){
            this.push(date);
            rectangle && rectangle.remove();
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

        if(l==1){
            this.push(date);
        	bandDIV.off("mousemove", renderRec);
        	listeners.splice(temp, 1);
        	afterSelect && afterSelect();
        }

        if(l>1){
            this.splice(0,1);
        	this.splice(0,1);
            this.add(date, pos);
        }
    };

    var getDate = function(event) {
        var A = SimileAjax.DOM.getEventRelativeCoordinates(event, this);
        var date = band._ether.pixelOffsetToDate(A.x + band._viewOffset).valueOf();

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
	    clean: function(){
            log(listeners);//--------------------------
			$.each(listeners, function(i, listener){
				listener["obj"].off(listener.event, listener.handler);
			});

	    	rectangle.remove();
            log($(".time-period-rec"));//----------------------
            $(".time-period-rec").remove();
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
    var band = timeline._bands[0];
    var bandDIV = $(band._div);
    var start = band._ether.dateToPixelOffset(zone.start);
    var end = band._ether.dateToPixelOffset(zone.end);
    var width = end - start;
    var rectangle = $('<div class="time-period-rec"></div>');
    rectangle.css({
        left: start - SimileAjax.DOM.getPageCoordinates(band._div).left,
        width: width
    }).appendTo(bandDIV);

  
    afterShow && afterShow();

    return {
        getRectangle: function(){
            return rectangle;
        },
        clean: function(){
            rectangle.remove();
        }
    };
}

function showTimeZones(timeline, zones, afterShow){
    var l = zones.length;
    var rectangles = [];
    $.each(zones, function(i,zone){
        if(i<l-1){
            var t = showTimeZone(timeline, zone);
            rectangles.push(t.getRectangle());
        }else{
            var t = showTimeZone(timeline, zone, afterShow);
            rectangles.push(t.getRectangle());
        }
    });

    return {
        getRectangles: function(){
            return rectangles;
        },
        clean: function(){
            $.each(rectangles, function(i, rectangle){
                rectangle.remove();
            });
        }
    };
}