// Build an array of all plots.
plots = Array();
for(var i = 0; i < 50; i++) {
	plots[i] = 'http://127.0.0.1/uav/gui/sensor-demo/images/time' + i + '.png';
}

function show_heatmaps() {
	// Get the current slider value to decide which image to show.
	currentSensorReading = $( ".date-slider" ).slider( "value" );
	// Change it to normal date and find the date.
	var date = new Date(currentSensorReading);
	var day = date.getDate();
	show_gaussian_plot(day);
}

function show_gaussian_plot(day) {
	// If there's already a gaussian overlay, remove that first.
	
	if (typeof gaussianOverlay !== 'undefined') {
		//console.log("Removing old overlay!");
		gaussianOverlay.setMap(null);
	}
	
	var day = day - 1;
	var source = plots[day];
	
	
	
	/*
	var gaussianBounds = new google.maps.LatLngBounds(
									new google.maps.LatLng(40.712216, -74.22655),
									new google.maps.LatLng(40.773941, -74.12544)
								);
    */
    var gaussianBounds = floorBounds;
    var overlayOptions = {
							opacity: 0.7
						};
	gaussianOverlay = new google.maps.GroundOverlay(source, gaussianBounds, overlayOptions);
	gaussianOverlay.setMap(map);
}

function remove_heatmaps() {
	if (typeof gaussianOverlay !== 'undefined') {
		//console.log("Removing old overlay!");
		gaussianOverlay.setMap(null);
	}
}
