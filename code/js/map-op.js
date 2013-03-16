function placeMarker(location, icon) {
  var marker = new google.maps.Marker({
      position: location,
      icon: icon || null,
      map: map
  });

  return marker;  
}

function destroyOverLay(obj) {
  if(obj) obj.setMap(null);
}


function drawPolygon(points){
  var polygon = new google.maps.Polygon({
    paths: points,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,

    fillColor: "#FF0000",
    fillOpacity: 0.35,

    editable: true
  });

  polygon.setMap(map);
  return polygon;
}

function enablePolygonSelect() {
  var overLays = {};

  var listeners = {};

  overLays["polygonMarkers"] = [];


  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polygon"]){ //to release certain polygon
      destroyOverLay(overLays["polygon"]);
      overLays["polygon"] = null;
    }

    var marker = placeMarker(event.latLng, polygonMarkerIcon);
    if(overLays["polygonMarkers"].push(marker)==1){
      marker.setIcon(polygonStartMarkerIcon);
      listeners["marker"] = google.maps.event.addListener(marker, 'click', function(event) {
        var points = [];
        var polygonMarker;

        while(polygonMarker = overLays["polygonMarkers"].pop()){
          points.push(polygonMarker.position);
          destroyOverLay(polygonMarker);
        }

        overLays["polygon"] = drawPolygon(points);

        overLays["polygonMarkers"] = [];
      });
    }
  });

  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    }
  };
}

function disablePolygonSelect(e){
  var listeners = e.getListeners();
  for(var i in listeners){
    google.maps.event.removeListener(listeners[i]);
  }

  var overLays = e.getOverLays();
  destroyOverLay(overLays["polygon"]);

  var polygonMarkers = overLays["polygonMarkers"];
  for (var i = polygonMarkers.length - 1; i >= 0; i--) {
    destroyOverLay(polygonMarkers[i]);
  };

  return null;
}
