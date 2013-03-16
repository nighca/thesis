var tm;
var map;
var e;

/**
 * bindings -------------------------------------------------------
 */

$(function(){
  $("#map-select").click(function(){
    if(e){
      e = disablePolygonSelect(e);
    }else{
      e = enablePolygonSelect();
    }
  });
});

/**
 * main -------------------------------------------------------
 */

$(function() { 
  // make a custom map style
  var simpleMapType = new google.maps.StyledMapType([
      {
          featureType: "road",
          elementType: "all",
          stylers: [
              { visibility: "off" }
          ]
      }
  ], {
      name: "simple"
  });
  
  tm = TimeMap.init({
      mapId: "map",               // Id of map div element (required)
      timelineId: "timeline",     // Id of timeline div element (required)
      options: {
          eventIconPath: "../images/"
      },
      datasets: [
          dataset
      ],
      bandIntervals: [
          Timeline.DateTime.DECADE, 
          Timeline.DateTime.CENTURY
      ]
  });
  
  // set the map to our custom style
  map = tm.getNativeMap();
  map.mapTypes.set("simple", simpleMapType);
  map.setMapTypeId("simple");
});