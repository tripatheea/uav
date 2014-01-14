<?php
	$tilesLocation = 'http://127.0.0.1/uav/tiles/tiles-list.html';
	$tiles = trim(file_get_contents($tilesLocation));
	$tiles = trim(json_encode(explode(';', $tiles)));
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta content="charset=utf-8">
	<title>Lat Long to Tile Coordinates</title>
</head>

<body>

	
	<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=true"></script>
	
	<script type="text/javvascript">
		
	</script>
	
	
	<script type="text/javascript">
		
		worldCoords = Object();
		latLong = $.parseJSON('<?php echo $tiles; ?>');
		TILE_SIZE = 30;
		zoomLevel = 29;		
		map = '';
		
		for (i = 0; i < latLong.length; i++) {
			
			if (typeof latLong[i] !== 'undefined') {
				coords = latLong[i].split(',');
				lat = coords[0];
				lon = coords[1].split('.');
				lon = lon[0] + '.' + lon[1];
				
				var chicago = new google.maps.LatLng(lat, lon);
				
				function bound(value, opt_min, opt_max) {
				  if (opt_min != null) value = Math.max(value, opt_min);
				  if (opt_max != null) value = Math.min(value, opt_max);
				  return value;
				}

				function degreesToRadians(deg) {
				  return deg * (Math.PI / 180);
				}

				function radiansToDegrees(rad) {
				  return rad / (Math.PI / 180);
				}
				
				/** @constructor */
				function MercatorProjection() {
				  this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
					  TILE_SIZE / 2);
				  this.pixelsPerLonDegree_ = TILE_SIZE / 360;
				  this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
				}

				MercatorProjection.prototype.fromLatLngToPoint = function(latLng,
					opt_point) {
				  var me = this;
				  var point = opt_point || new google.maps.Point(0, 0);
				  var origin = me.pixelOrigin_;

				  point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

				  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
				  // about a third of a tile past the edge of the world tile.
				  var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999,
					  0.9999);
				  point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) *
					  -me.pixelsPerLonRadian_;
				  return point;
				};

				MercatorProjection.prototype.fromPointToLatLng = function(point) {
				  var me = this;
				  var origin = me.pixelOrigin_;
				  var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
				  var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
				  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) -
					  Math.PI / 2);
				  return new google.maps.LatLng(lat, lng);
				};

				function createInfoWindowContent() {
					
				  var numTiles = 1 << zoomLevel;
				  var projection = new MercatorProjection();
				  var worldCoordinate = projection.fromLatLngToPoint(chicago);
				  var pixelCoordinate = new google.maps.Point(
					  worldCoordinate.x * numTiles,
					  worldCoordinate.y * numTiles);
				  var tileCoordinate = new google.maps.Point(
					  Math.floor(pixelCoordinate.x / TILE_SIZE),
					  Math.floor(pixelCoordinate.y / TILE_SIZE));

				  return [
					chicago.lat() + ',' + chicago.lng(),
					worldCoordinate.x + ',' + worldCoordinate.y,
					Math.floor(pixelCoordinate.x) + ',' + Math.floor(pixelCoordinate.y),
					tileCoordinate.x + ',' + tileCoordinate.y
				  ];
				}
				
				details = createInfoWindowContent();
				worldCoords[details[0]] = details[3];
			}
		}
		
		document.write('<p>' + JSON.stringify(worldCoords) + '</p>');
	</script>

</body>
</html>




</html>
