function hs_detection(coords, detection) {
  if ( ! detection) {
    return;
  }

  var x = coords[0];
  var y = coords[1];
  var whichGrid = point_to_tile(coords);
  console.log(whichGrid);
  var index = whichGrid[0] + "," + whichGrid[1];
  color_tile(index, "#ff0000");
}

function color_tile(commaIndex, color) {
  // Use this to trigger a sort of warning about a particular tile.
  var hyphenIndex = commaIndex.split(',');
  var commaIndex2 = hyphenIndex[0] + ',' + hyphenIndex[1];
  var hyphenIndex = hyphenIndex[0] + '-' + hyphenIndex[1];
  var selector = "." + hyphenIndex;
  
  var arg = 'color|' + color;
  grids['points'][commaIndex2]['action'] = Array(arg);
  $(selector).trigger( "click" ); 
}

function point_to_tile(point) {
  var se = [ flyingRegionCoordinates[0][0], flyingRegionCoordinates[1][1] ];
  
  x = point[0];
  y = point[1];

  var xCoords = Math.floor( (x - se[0]) / Math.abs(gridWidth * 1) );
  var yCoords = Math.floor( (y - se[1]) / Math.abs(gridHeight * 1) );

  xCoords = Math.abs(xCoords);
  yCoords = Math.abs(yCoords);
  
  yCoords = yCoords - 1;

  return [yCoords, xCoords];
}