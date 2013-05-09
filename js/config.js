var spaceZoneTypes = ["Null", "point", "polyline", "polygon"];

var defaultRadius = 500;

var datasetId = "timeSpaceObjs";

var pointMarkerIcon = {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: "blue",
  fillOpacity: 0.8,
  scale: 1,
  strokeColor: "blue",
  strokeWeight: 10
};

var polylineMarkerIcon = {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: "yellow",
  fillOpacity: 0.8,
  scale: 1,
  strokeColor: "yellow",
  strokeWeight: 8
};

var polygonMarkerIcon = {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: "yellow",
  fillOpacity: 0.8,
  scale: 1,
  strokeColor: "yellow",
  strokeWeight: 8
};

var polygonStartMarkerIcon = {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: "red",
  fillOpacity: 0.8,
  scale: 1,
  strokeColor: "red",
  strokeWeight: 8
};