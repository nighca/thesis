function placeMarker(map, location, icon) {
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


function drawPolygon(map, points, fill){
  fillColor = fill ? "#ff0000" : null;
  fillOpacity = fill ? 0.35 : null;
  var polygon = new google.maps.Polygon({
    paths: points,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,

    fillColor: fillColor,
    fillOpacity: fillOpacity,

    editable: true
  });

  polygon.setMap(map);
  return polygon;
}

function drawPolyline(map, points){
  var polyline = new google.maps.Polyline({
    path: points,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,

    editable: true
  });

  polyline.setMap(map);
  return polyline;
}

function enablePointSelect(map, afterSelect) {
  console.log("Point select");//--------------------
  var overLays = {
    "point" : null
  };
  var listeners = {};

  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["point"]){ //to release certain point
      destroyOverLay(overLays["point"]);
      overLays["point"] = null;
    }

    var marker = placeMarker(map, event.latLng, pointMarkerIcon);
    overLays["point"] = marker;

    afterSelect && afterSelect();
  });

  
  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    },
    type: 1
  };
}

function disablePointSelect(e){
  var listeners = e.getListeners();
  for(var i in listeners){
    google.maps.event.removeListener(listeners[i]);
  }

  var overLays = e.getOverLays();
  destroyOverLay(overLays["point"]);

  return null;
}

function enableLineSelect(map, afterSelect) {
  console.log("Line select");//--------------------
  var overLays = {
    "polylineMarkers" : [],
    "polyline" : null
  };
  var listeners = {};
  var points = [];
  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polyline"]){ //to release certain polyline
      destroyOverLay(overLays["polyline"]);
      overLays["polyline"] = null;
    }

    var marker = placeMarker(map, event.latLng, polylineMarkerIcon);
    points.push(marker.position);
    overLays["polyline"] = drawPolyline(map, points, true);
    overLays["polylineMarkers"].push(marker);

    afterSelect && afterSelect();
  });
  
  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    },
    type: 2
  };
}

function disableLineSelect(e){
  var listeners = e.getListeners();
  for(var i in listeners){
    google.maps.event.removeListener(listeners[i]);
  }

  var overLays = e.getOverLays();
  destroyOverLay(overLays["polyline"]);

  var polylineMarkers = overLays["polylineMarkers"];
  for (var i = polylineMarkers.length - 1; i >= 0; i--) {
    destroyOverLay(polylineMarkers[i]);
  };

  return null;
}

function enableBorderSelect(map, afterSelect) {
  console.log("Border select");//--------------------
  var overLays = {
    "polygonMarkers" : [],
    "polygon" : null
  };
  var listeners = {};
  var points = [];
  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polygon"]){ //to release certain polygon
      destroyOverLay(overLays["polygon"]);
      overLays["polygon"] = null;
    }

    var marker = placeMarker(map, event.latLng, polygonMarkerIcon);
    points.push(marker.position);
    overLays["polygon"] = drawPolygon(map, points, false);

    if(overLays["polygonMarkers"].push(marker)==1){
      marker.setIcon(polygonStartMarkerIcon);

      listeners["marker"] = google.maps.event.addListener(marker, 'click', function(event) {
        // var points = [];
        var polygonMarker;

        while(polygonMarker = overLays["polygonMarkers"].pop()){
          // points.push(polygonMarker.position);
          destroyOverLay(polygonMarker);
        }
        overLays["polygonMarkers"] = [];
        points = [];
      });
    }

    afterSelect && afterSelect();
  });

  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    },
    type: 3
  };
}

function disableBorderSelect(e){
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

function enablePolygonSelect(map, afterSelect) {
  console.log("Polygon select");//--------------------
  var overLays = {
    "polygonMarkers" : [],
    "polygon" : null
  };
  var listeners = {};
  var points = [];
  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polygon"]){ //to release certain polygon
      destroyOverLay(overLays["polygon"]);
      overLays["polygon"] = null;
    }

    var marker = placeMarker(map, event.latLng, polygonMarkerIcon);
    points.push(marker.position);
    overLays["polygon"] = drawPolygon(map, points, true);

    if(overLays["polygonMarkers"].push(marker)==1){
      marker.setIcon(polygonStartMarkerIcon);

      listeners["marker"] = google.maps.event.addListener(marker, 'click', function(event) {
        // var points = [];
        var polygonMarker;

        while(polygonMarker = overLays["polygonMarkers"].pop()){
          // points.push(polygonMarker.position);
          destroyOverLay(polygonMarker);
        }
        overLays["polygonMarkers"] = [];
        points = [];
      });
    }

    afterSelect && afterSelect();
  });

  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    },
    type: 4
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
