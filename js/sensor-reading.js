function water_sensing_color_tile(coords) {
	
	var tileCoords = point_to_tile(coords);
	var color = 'rgb(' + sensorReading + ', 0, 0)';
	
	var hyphenIndex = tileCoords[0] + '-' + tileCoords[1];
	var commaIndex = tileCoords[0] + ',' + tileCoords[1];
	var selector = "." + hyphenIndex;
	
	var arg = 'color|' + color;
	grids['points'][commaIndex]['action'] = Array('color', color);
	$(selector).trigger( "click" );
	
	
}

/*

function color_tile(commaIndex, color) {
	
	// Use this to trigger a sort of warning about a particular tile.
	
	var hyphenIndex = commaIndex.split(',');
	commaIndex = hyphenIndex[0] + ',' + hyphenIndex[1];
	var hyphenIndex = hyphenIndex[0] + '-' + hyphenIndex[1];
	var selector = "." + hyphenIndex;
	
	
	var arg = 'color|' + color;
	grids['points'][commaIndex]['action'] = Array(arg);
	$(selector).trigger( "click" );	
}
* 
*/

function sensor_reading_to_circles(position, reading) {	//position, color
	
	var circle = {};
	circle = {
		center: new google.maps.LatLng(position[1], position[0]),
		value: reading
	};
	

	var color = 'rgb(0, ' + sensorReading + ', 0)';
	
	var circleOptions = {
		strokeColor: '#000000',
		strokeOpacity: 0.8,
		strokeWeight: 1,
		fillColor: color,
		fillOpacity: 0.7,
		zIndex: 999,
		map: map,
		center: circle.center,
		radius: circle.value * 200
	};
	// Add the circle for this city to the map.
	sensorCircle = new google.maps.Circle(circleOptions);
}


function point_to_tile(point) {
	tiles = grids['points'];
	x = point[0];
	y = point[1];
	
	gridWidth = Math.abs(gridWidth);
	gridHeight = Math.abs(gridHeight);
	
	xCoords = Math.floor(parseInt(x/gridHeight));
	yCoords = Math.floor(parseInt(y/gridWidth));
	
	yCoords = yDivision - 1 - yCoords;
	
	return [xCoords, yCoords];
}
