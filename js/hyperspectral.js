function generate_random_image_array(x, y) {
	image = Object();
	min = 0;
	max = 255;
	for(var i = 0; i < x; i++) {
		for(var j = 0; j < y; j++) {
			
			first = Math.floor(Math.random() * (max - min + 1)) + min;
			second = Math.floor(Math.random() * (max - min + 1)) + min;
			third = Math.floor(Math.random() * (max - min + 1)) + min;
			image[i + "," + j] = 'rgb(' + first + ', ' + second + ', ' + third + ')';
		}
	}

	return image;
}




function show_hyperspectral() {
	arrayWidth = 50;
	arrayHeight = 50;
	
	var nw = [ floorBounds['ta']['d'], floorBounds['ta']['b'] ];
	var se = [ floorBounds['ia']['d'], floorBounds['ia']['b'] ];
	
	entireRect = new Rectangle(nw, se, false, "entire");
	
	var entireGrids = divide_into_grids(entireRect, [arrayWidth, arrayHeight]);
	var image = generate_random_image_array(arrayWidth, arrayHeight);
	var i = 0;
	colorfulGrids = Object();
	for (var index in entireGrids) {
		var rect = entireGrids[index];
		
		var swBound = new google.maps.LatLng(rect['se'][1], rect['nw'][0]);
		var neBound = new google.maps.LatLng(rect['nw'][1], rect['se'][0]);
		
		var bounds = new google.maps.LatLngBounds(swBound, neBound);
        grid = new hyperspectralOverlay(bounds, map, index, image[index]);
		colorfulGrids[index] = grid;
		
		i++;
	}
	
}

function remove_hyperspectral() {
	for (var index in colorfulGrids) {
		colorfulGrids[index].onRemove();
	}
}




/* Hyperspectral Custom overlay code */

var overlay;
hyperspectralOverlay.prototype = new google.maps.OverlayView();

/** @constructor */
function hyperspectralOverlay(bounds, map, index, background) {
	var opacity = 0.7;
	// Initialize all properties.
	this.bounds_ = bounds;
	this.background_ = background;
	this.opacity_ = opacity;
	this.index_ = index;
	this.map_ = map;
	
	// Define a property to hold the image's div. We'll
	// actually create this div upon receipt of the onAdd()
	// method so we'll leave it null for now.
	this.div_ = null;


	// Explicitly call setMap on this overlay.
	this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
hyperspectralOverlay.prototype.onAdd = function() {
	var div = document.createElement('div');
	
	div.style.position = 'absolute';
	div.style.background = this.background_;
	div.style.margin = '0';
	div.style.opacity = this.opacity_;
	div.style.zIndex = 11;

	
	//div.className = this.index_;
	var name = this.index_;
	name = name.split(',');
	div.className = name[0] + '-' + name[1];


	
	this.div_ = div;
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);

	var index = this.index_;
};

hyperspectralOverlay.prototype.draw = function() {

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  var overlayProjection = this.getProjection();

  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  // We'll use these coordinates to resize the div.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's div to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};



// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
hyperspectralOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};
