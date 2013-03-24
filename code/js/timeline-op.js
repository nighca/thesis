var zoom = function (timemap, bandIndex, InOut) {
	try{
		if(typeof InOut !== "boolean" || typeof timemap !== "object" || typeof bandIndex !== "number"){
			throw new Error("Wrong arguments for zoom!")
		}
	} catch (e) {
		alert(e)
	}

	var timeline = timemap.timeline;
	var Eband = timeline.getBand(bandIndex)._div;

	var Etimeline = timeline._containerDiv;
	var x = -parseInt(Eband.style.left) + $(Etimeline).width()/2;
	var y = 0;

	return timeline.zoom(InOut, x, y, Eband);
};

var zoomIn = function(timemap, bandIndex){
	return zoom(timemap, bandIndex, true);
};

var zoomOut = function(timemap, bandIndex){
	return zoom(timemap, bandIndex, false);
};