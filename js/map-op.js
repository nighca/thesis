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

function drawCircle(map, center, radius, fill){
  radius = radius || defaultRadius;
  fillColor = fill ? "#ff0000" : null;
  fillOpacity = fill ? 0.35 : null;
  var circle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: fillColor,
    fillOpacity: fillOpacity,

    map: map,
    center: center,
    radius: radius,

    editable: true
  });

  return circle;
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
    "circle" : null
  };
  var listeners = {};

  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["circle"]){ //to release certain point
      destroyOverLay(overLays["circle"]);
      overLays["circle"] = null;
    }

    var circle = drawCircle(map, event.latLng, null, true);
    overLays["circle"] = circle;

    afterSelect && afterSelect();
  });

  
  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    },
    clean: function(){
      $.each(listeners, function(i, listener){
        google.maps.event.removeListener(listener);
      });

      $.each(overLays, function(key, val){
        destroyOverLay(val);
      });
    },
    type: 1
  };
}

function enablePointSelectWithRadius(map, afterSelect) {
  console.log("Point select");//--------------------
  var overLays = {
    "circle" : null
  };
  var listeners = {};

  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["circle"]){ //to release certain point
      destroyOverLay(overLays["circle"]);
      overLays["circle"] = null;
    }

    var circle = drawCircle(map, event.latLng, null, true);
    overLays["circle"] = circle;

    afterSelect && afterSelect();
  });

  
  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    },
    clean: function(){
      $.each(listeners, function(i, listener){
        google.maps.event.removeListener(listener);
      });

      $.each(overLays, function(key, val){
        destroyOverLay(val);
      });
    },
    type: 1
  };
}

function enableLineSelect(map, afterSelect) {
  console.log("Line select");//--------------------
  var overLays = {
    "circle" : null,
    "polyline" : null
  };
  var listeners = {};
  var points = [];
  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polyline"]){ //to release certain polyline
      destroyOverLay(overLays["polyline"]);
      overLays["polyline"] = null;
    }

    var pointNum = points.push(event.latLng);
    overLays["polyline"] = drawPolyline(map, points, true);
    if(pointNum==1){
      //overLays["circle"] = drawCircle(map, event.latLng, null, true);
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
    clean: function(){
      $.each(listeners, function(i, listener){
        google.maps.event.removeListener(listener);
      });

      $.each(overLays, function(key, val){
        destroyOverLay(val);
      });
    },
    type: 2
  };
}

function enableLineSelectWithRadius(map, afterSelect) {
  console.log("Line select");//--------------------
  var overLays = {
    "circle" : null,
    "polyline" : null
  };
  var listeners = {};
  var points = [];
  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polyline"]){ //to release certain polyline
      destroyOverLay(overLays["polyline"]);
      overLays["polyline"] = null;
    }

    var pointNum = points.push(event.latLng);
    overLays["polyline"] = drawPolyline(map, points, true);
    if(pointNum==1){
      overLays["circle"] = drawCircle(map, event.latLng, null, true);
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
    clean: function(){
      $.each(listeners, function(i, listener){
        google.maps.event.removeListener(listener);
      });

      $.each(overLays, function(key, val){
        destroyOverLay(val);
      });
    },
    type: 2
  };
}

function enablePolygonSelect(map, afterSelect) {
  console.log("Polygon select");//--------------------
  var overLays = {
    "polygon" : null
  };
  var listeners = {};
  var points = [];
  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polygon"]){ //to release certain polygon
      destroyOverLay(overLays["polygon"]);
      overLays["polygon"] = null;
    }
    points.push(event.latLng);
    overLays["polygon"] = drawPolygon(map, points, true);

    afterSelect && afterSelect();
  });

  return {
    getOverLays: function(){
      return overLays;
    },
    getListeners: function(){
      return listeners;
    },
    clean: function(){
      $.each(listeners, function(i, listener){
        google.maps.event.removeListener(listener);
      });

      $.each(overLays, function(key, val){
        destroyOverLay(val);
      });
    },
    type: 4
  };
}

function enablePolygonSelectWithRadius(map, afterSelect) {
  console.log("Border select");//--------------------
  var overLays = {
    "circle" : null,
    "polygon" : null
  };
  var listeners = {};
  var points = [];
  
  listeners["map"] = google.maps.event.addListener(map, 'click', function(event) {
    if(overLays["polygon"]){ //to release certain polygon
      destroyOverLay(overLays["polygon"]);
      overLays["polygon"] = null;
    }

    var pointNum = points.push(event.latLng);
    overLays["polygon"] = drawPolygon(map, points, false);

    if(pointNum==1){
      overLays["circle"] = drawCircle(map, event.latLng, null, true);
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
    clean: function(){
      $.each(listeners, function(i, listener){
        google.maps.event.removeListener(listener);
      });

      $.each(overLays, function(key, val){
        destroyOverLay(val);
      });
    },
    type: 3
  };
}

function disableSpaceSelect(e){
  e && e.clean();
  return null;
}

function showSpaceZone(map, zone, afterShow){
  var overLays = {};
  switch(zone.type){
    case 1:
      //do sth...
      var center = new google.maps.LatLng(zone.center.lat, zone.center.lng);
      var radius = zone.radius;
      overLays.circle = drawCircle(map, center, radius);
      break;
    case 2:
      //do sth...
      var points = [];
      for (var i = 0, l = zone.points.length; i < l; i++) {
        var point = new google.maps.LatLng(zone.points[i].lat, zone.points[i].lng);
        points.push(point);
      };
      var center = points[0];
      //var radius = zone.radius;
      overLays.polyline = drawPolyline(map, points);
      //overLays.circle = drawCircle(map, center, radius);
      break;
    case 3:
      //do sth...
      var points = [];
      for (var i = 0, l = zone.points.length; i < l; i++) {
        var point = new google.maps.LatLng(zone.points[i].lat, zone.points[i].lng);
        points.push(point);
      };
      overLays.polygon = drawPolygon(map, points, true);
      break;
    default:
      //do sth...
      break;
  }

  afterShow && afterShow();

  return {
    getOverLays: function(){
      return overLays;
    },
    clean: function(){
      $.each(overLays, function(key, val){
        destroyOverLay(val);
      });
    }
  };
}

function showSpaceZones(map, zones, afterShow){
  var l = zones.length;
  var overLaysArr = [];
  $.each(zones, function(i,zone){
    if(i<l-1){
      var t = showSpaceZone(map, zone);
      overLaysArr.push(t.getOverLays());
    }else{
      var t = showSpaceZone(map, zone, afterShow);
      overLaysArr.push(t.getOverLays());
    }
  });

  return {
    getOverLaysArr: function(){
      return overLaysArr;
    },
    clean: function(){
      $.each(overLaysArr, function(i, overLays){
        $.each(overLays, function(key, val){
          destroyOverLay(val);
        });
      });
    }
  };
}