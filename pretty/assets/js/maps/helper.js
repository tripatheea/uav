function convert_coordinates(x, y, zoom, tileSize) {
  var numTiles = 1 << zoom;

  pixelX = x * tileSize;
  pixelY = y * tileSize;

  convertedX = pixelX / Math.pow(2, zoom);
  convertedY = pixelY / Math.pow(2, zoom);

  return [convertedX, convertedY];
}

function vicon_to_gui_offset_fix(x, y) {
  return [(0 - x) + 0.005, (0 - y) + 1.41]; 
}