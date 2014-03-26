flyingRegionCoordinates = [[-5.7, -4.3], [0.05, 1.55]];
tileSize = 128;
minZoomLevel = 7;
maxZoomLevel = 9;

function CoordMapType() {
  // This function needs to be here. Do not remove this.
}

CoordMapType.prototype.tileSize = new google.maps.Size(tileSize, tileSize);
CoordMapType.prototype.maxZoom = 20;

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var worldCoord = convert_coordinates(coord.x, coord.y, zoom, tileSize);
	var div = ownerDocument.createElement('div');

  div.style.width = this.tileSize.width + "px";
  div.style.height = this.tileSize.height + "px";
  div.style.backgroundColor = "#e6eef0";
  
  if (worldCoord[0] % 1 === 0) {
    div.style.borderLeft = "1px dotted #d1ddff";
  }
  if (worldCoord[1] % 1 === 0) {
    div.style.borderTop = "1px dotted #d1ddff";
  }
  if ( (worldCoord[0] + (1 / (Math.pow(2, (zoom - minZoomLevel))))) % 1 === 0 ) {
    div.style.borderRight = "1px dotted #d1ddff";
  }
  if ( (worldCoord[1] + (1 / (Math.pow(2, (zoom - minZoomLevel))))) % 1 === 0 ) {
    div.style.borderBottom = "1px dotted #d1ddff";
  }

  // Surroung the flying region with a 2px dashed border.
  if (worldCoord[1] >= 128 && worldCoord[1] < 132) {
    if (worldCoord[0] == 125) {
      div.style.borderLeft = "2px dashed #000";  
    }
    else if (worldCoord[0] == 129) {
      div.style.borderLeft = "2px dashed #000";  
    }
  }
  
  if(worldCoord[0] >= 125 && worldCoord[0] < 129) {
    if (worldCoord[1] == 128) {
      div.style.borderTop = "2px dashed #000";
    }
    else if (worldCoord[1] == 132) {
      div.style.borderTop = "2px dashed #000";  
    }
  }


  return div;
};

CoordMapType.prototype.name = "UAV Map";
CoordMapType.prototype.alt = "UAV Map";

var map;
var coordinateMapType = new CoordMapType();

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(-2.5, -2.5),
    zoom: minZoomLevel,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
		tilt: 0,
		disableDefaultUI: true,
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      
  
	// Bind custom map to the current map object.
	map.mapTypes.set('coordinate',coordinateMapType);
	map.setMapTypeId('coordinate');
  
  flyingGridBounds = new google.maps.LatLngBounds(
                      new google.maps.LatLng(flyingRegionCoordinates[0][0], flyingRegionCoordinates[0][1]),								
                      new google.maps.LatLng(flyingRegionCoordinates[1][0], flyingRegionCoordinates[1][1])											
                  );

  // The following is to limit panning to the region defined by the flying region.
  
  var allowedBounds = flyingGridBounds;


  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(-2, -7),
      map: map,
      draggable: true,
      title: 'Hello World!'
  });
  
  google.maps.event.addListener(marker, 'dragend', function(event) {
    console.log(event.latLng['k'] + "," + event.latLng['A']);
  });
  
  // Listen for the dragend event
  google.maps.event.addListener(map, 'dragend', function() {
    
    if (allowedBounds.contains(map.getCenter())) return;

    // Out of bounds - Move the map back within the bounds
    var c = map.getCenter(),
    x = c.lng(),
    y = c.lat(),
    maxX = allowedBounds.getNorthEast().lng(),
    maxY = allowedBounds.getNorthEast().lat(),
    minX = allowedBounds.getSouthWest().lng(),
    minY = allowedBounds.getSouthWest().lat();

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    map.setCenter(new google.maps.LatLng(y, x));
  });

  // Limit the zoom level
  google.maps.event.addListener(map, 'zoom_changed', function() {
    if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
    if (map.getZoom() > maxZoomLevel) map.setZoom(maxZoomLevel);
  });

  // Show all the markers ("X") at the centres of the grids.

  markersPosition = calculate_markers_position();
  
  for (i = 0; i < markersPosition.length; i++) {

    var mapLabel = new MapLabel({
                                 text: 'X',
                                 position: new google.maps.LatLng(markersPosition[i][0], markersPosition[i][1]),
                                 map: map,
                                 fontSize: 15,
                                 align: 'center'
                               });
    mapLabel.set('position', new google.maps.LatLng(markersPosition[i][0], markersPosition[i][1]));
  }

}

google.maps.event.addDomListener(window, 'load', initialize);


function calculate_markers_position() {
  // Calculate where the markers ("X") need to be.
  flyingRegionWidth = flyingRegionCoordinates[1][0] - flyingRegionCoordinates[0][0];
  flyingRegionHeight = flyingRegionCoordinates[1][1] - flyingRegionCoordinates[0][1];

  gridWidth = flyingRegionWidth / 4;
  gridHeight = flyingRegionHeight / 4;
  
  positions = [];
  for (i = 1; i < 8; i += 2) {
    for (j = 1; j < 8; j += 2) {
      positions.push([(flyingRegionCoordinates[1][0] - i * gridWidth / 2), (flyingRegionCoordinates[1][1] - j * gridHeight / 2)]);
    }
  }
  return positions;
}