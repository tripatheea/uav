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
