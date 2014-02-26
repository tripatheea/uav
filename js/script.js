/*
 * The following couple of functions is to remove the Satellite / Hybrid / Terrain / Roadmap map and instead show a gray area.
 *
 * I'm just creating a custom maptype but not supplying any tile sources to force Maps to show the default gray tiles.
 * 
 */
function CoordMapType() {
}

CoordMapType.prototype.tileSize = new google.maps.Size(256,256);
CoordMapType.prototype.maxZoom = 20;

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
	return ownerDocument.createElement('div');
};

CoordMapType.prototype.name = "UAV Map";
CoordMapType.prototype.alt = "UAV Map";

var map;
var coordinateMapType = new CoordMapType();


/* 
 * Initalize the awesome! 
 * 
 */

function initialize() {
	var minZoomLevel = 6;
	var myLatlng = new google.maps.LatLng(-1.82611289, -2.44480038);
	var mapOptions = {
		zoom: (minZoomLevel + 1),
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		tilt: 0,
		disableDefaultUI: true,
		mapTypeControlOptions: {
			mapTypeIds: ['coordinate']
		}
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	var holodeckURL = 'http://127.0.0.1/uav/gui/images/holodeck.png?r=2';
	var floorPlanURL = 'http://127.0.0.1/uav/gui/images/floorplan.png?r=4'; 
	
	// x and y are flipped here.
	holodeckBounds = new google.maps.LatLngBounds(
								new google.maps.LatLng(-4.50222577, -6.38960075),								
								new google.maps.LatLng(0.85, 1.5)											
						);
	
	floorBounds = new google.maps.LatLngBounds(
								
								new google.maps.LatLng(-3.6522257702209595, -4.889600753195714),			
								new google.maps.LatLng(0, 0)												
						);
	
	holodeckOverlay = new google.maps.GroundOverlay(holodeckURL, holodeckBounds, { zIndex: 6 } );
	floorOverlay = new google.maps.GroundOverlay(floorPlanURL, floorBounds, { zIndex: 5 } );
	
	holodeckOverlay.setMap(map);
	floorOverlay.setMap(map);
	
	
	/* 
	 * The followin is just to bind the custom map to Map.
	 * Remove all below this line (inside the current function of course if you'd rather show a satellite (or roadmap or terrain or hybrid) map.
	 *  
	 */
	 
	// Now attach the coordinate map type to the map's registry.
	map.mapTypes.set('coordinate',coordinateMapType);

	// We can now set the map to use the 'coordinate' map type.
	map.setMapTypeId('coordinate');
	
	/*
	 * The following is to limit panning to the region defined by the floorplan.
	 * 
	 */
	
	var allowedBounds = floorBounds;

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

		//map.setCenter(new google.maps.LatLng(y, x));
	});

	// Limit the zoom level
	google.maps.event.addListener(map, 'zoom_changed', function() {
		if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
	});
	
}

google.maps.event.addDomListener(window, 'load', initialize);

function createContext (marker, iw){
	google.maps.event.addListener(marker,'click',function() {
		iw.open(map, marker);
	});
}


function show_all_markers() {
	if( (typeof markers === 'undefined') || (markers.length == 0) ) {
		
		markers = [];
		infoWindow = [];		
		for (i = 0; i < locations.length; i++) {
			marker = new google.maps.Marker({
							position: new google.maps.LatLng(locations[i][0], locations[i][1]),
							map: map,
							title: 'UAV ' + i
					});
					
			// Bind info window to the markers.
			
			infoWindow[i] = new google.maps.InfoWindow({
				content: UAVInfo[i]
			});
			
			createContext(marker, infoWindow[i]); 
					
			// Push current marker in.
			markers.push(marker);
		}
		
		for (j = 0; j < markers.length; j++) {
			markers[j].setMap(map);
		}
	}
	else {
		for (j = 0; j < markers.length; j++) {
			markers[j].setMap(null);
		}
		markers = [];
	}
}

dataHash = '';
function show_tracking_markers() {	

	var url = 'http://127.0.0.1/uav/gui/php/getMarkers.php';
	var data = $.ajax({
				url:  url,
				dataType: "json", 
				async: false
			}); // This will wait until you get a response from the ajax request.
	
	if ($.md5(data.responseText) != dataHash) {
		
		dataHash = $.md5(data.responseText);
		data = jQuery.parseJSON(data.responseText);
		
		// Reset previous tracking markers first.
		if (typeof trackingMarkers !== 'undefined' && trackingMarkers.length != 0) { 
			for (j = 0; j < trackingMarkers.length; j++) {
				trackingMarkers[j].setMap(null);
			}
		}
		
		trackingLocations = [];
		for (i = 0; i < data.length; i++) {
			position = [ data[i]['latitude'], data[i]['longitude'], data[i]['text'] ];
			trackingLocations.push(position);
		}
		
		trackingMarkers = [];
		infoWindow = [];		
		for (i = 0; i < trackingLocations.length; i++) {
			marker = new google.maps.Marker({
							position: new google.maps.LatLng(trackingLocations[i][0], trackingLocations[i][1]),
							map: map,
							title: 'UAV ' + i
					});
					
			// Bind info window to the markers.
			
			infoWindow[i] = new google.maps.InfoWindow({
				content: trackingLocations[i][2]
			});
			
			createContext(marker, infoWindow[i]); 
					
			// Push current marker in.
			trackingMarkers.push(marker);
		}
		
		for (j = 0; j < trackingMarkers.length; j++) {
			trackingMarkers[j].setMap(map);
		}
	} else {
		reset = false;
	}
}

$(document).ready(function() {
	tracking = false;

	locations = [
					[42.3535, -71.0938],
					[42.3530, -71.0880],
					[42.3575, -71.0850],
					[42.3565, -71.0800]
				];

	// Also get the info windows ready.
	UAVInfo = [];
	UAVInfo[0] = '<div class="UAV-info"><div class="title" style="font-weight: bold; font-size: 15px;">UAV 0</div><div class="other"><strong>Location: </strong>' + locations[0][0] + ', ' + locations[0][1] + '<br><strong>Status: </strong><span style="color: green;">OK</span><br><strong>Battery: </strong><span style="color: green;">75% (7 hrs 5 mins remaining)</span></div></div>';
	UAVInfo[1] = '<div class="UAV-info"><div class="title" style="font-weight: bold; font-size: 15px;">UAV 1</div><div class="other"><strong>Location: </strong>' + locations[1][0] + ', ' + locations[1][1] + '<br><strong>Status: </strong><span style="color: red;">Dying</span><br><strong>Battery: </strong><span style="color: red;">15% (2 hrs 4 mins remaining)</span></div></div>';
	UAVInfo[2] = '<div class="UAV-info"><div class="title" style="font-weight: bold; font-size: 15px;">UAV 2</div><div class="other"><strong>Location: </strong>' + locations[2][0] + ', ' + locations[2][1] + '<br><strong>Status: </strong><span style="color: blue;">OK</span><br><strong>Battery: </strong><span style="color: blue;">34% (4 hrs 37 mins remaining)</span></div></div>';
	UAVInfo[3] = '<div class="UAV-info"><div class="title" style="font-weight: bold; font-size: 15px;">UAV 3</div><div class="other"><strong>Location: </strong>' + locations[3][0] + ', ' + locations[3][1] + '<br><strong>Status: </strong><span style="color: green;">OK</span><br><strong>Battery: </strong><span style="color: green;">94% (9 hrs 56 mins remaining)</span></div></div>';

	
});


$(document).ready(function() {
	populate_instructions();
	setInterval(function() { 
					if (tracking) {
						show_tracking_markers();
					}
				}, 1000);
});

uavLocation = false;
$('.uav-location').click(function() {
	show_all_markers();
	if (uavLocation) {
		uavLocation = false;
		$('.uav-location').css('color', '#575757');
	} else {
		uavLocation = true;
		$('.uav-location').css('color', '#fff');
	}
});

chloro = false;
$('.chloro').click(function() {
	show_cholorophyll();
	if (chloro) {
		chloro = false;
		$('.chloro').css('color', '#575757');
	} else {
		chloro = true;
		$('.chloro').css('color', '#fff');
	}
});

phy = false;
$('.phy').click(function() {
	show_phycocyanin();
	if (phy) {
		phy = false;
		$('.phy').css('color', '#575757');
	} else {
		phy = true;
		$('.phy').css('color', '#fff');
	}
});

$('.tracking').click(function() {
	if (tracking) {
		tracking = false;
		if (typeof trackingMarkers !== 'undefined' && trackingMarkers.length != 0) { 
			for (j = 0; j < trackingMarkers.length; j++) {
				trackingMarkers[j].setMap(null);
			}
		}
		$('.tracking').css('color', '#575757');
	}
	else {
		tracking = true;
		$('.tracking').css('color', '#fff');
	}
});

heatmaps = false;;
$('.heatmaps').click(function() {
	if( ! heatmaps ) {
		show_heatmaps();
		heatmaps = true;
		$('.heatmaps').css('color', '#fff');
	} else {
		remove_heatmaps();
		heatmaps = false;
		$('.heatmaps').css('color', '#575757');
	}
});

waterSensing = false;
$('.water-probe').click(function() {
	if( ! waterSensing ) {
		waterSensing = true;
		
		// Clear imagingArea thingy.
		aerialImaging = true;
		$('.imaging-area').trigger("click");
		
		var nw = [ floorBounds['ta']['d'], floorBounds['ta']['b'] ];
		var se = [ floorBounds['ga']['d'], floorBounds['ga']['b'] ];
		position = [nw, se];
		draw_grid(position);
		$('.water-probe').css('color', '#fff');
		$('.jarvis').html(instructions['imaging'][1]);
	} else {
		waterSensing = false;
		for (var index in allTiles) {
			allTiles[index].onRemove();
		}
		
		$('.water-probe').css('color', '#575757');
		$('.jarvis').html('');
	}
});

function populate_instructions() {
	instructionStatus = [];
	instructions = [];
	
	instructionStatus['imaging'] = [false, false, false, false];
	instructions['imaging'] = [];
	instructions['imaging'][0] = "Please click on the magnifying glass icon below the zoom slider on the map and then drag to select a region.";
	instructions['imaging'][1] = "Are you sure? <span class='confirmation jarvis-imaging-1-yes'>Yes</span>&nbsp;/&nbsp;<span class='confirmation jarvis-imaging-1-no'>No</span>";
	instructions['imaging'][2] = "Send coordinates to UAV? <span class='confirmation jarvis-imaging-2-yes'>Yes</span>&nbsp;/&nbsp;<span class='confirmation jarvis-imaging-2-no'>No</span>";
	instructions['imaging'][3] = "UAV Dispatched!";
}

$(document).on("click",".jarvis-imaging-1-yes",function(){
	$('.jarvis').html(instructions['imaging'][2]);
	// See line ~170 of regions.js
	// $( ".0-1" ).trigger( "click" );
	console.log( "Data ready to be transmitted!" );
	//console.log(JSON.stringify(grids));
});

$(document).on("click",".jarvis-imaging-1-no",function(){
	$('.jarvis').html('');
	map.disableKeyDragZoom();
	$('.water-probe').css('color', '#575757');
});

$(document).on("click",".jarvis-imaging-2-yes",function(){
	$('.jarvis').html(instructions['imaging'][3] + "<br><br>North West Coordinates: " + position[0] + "<br>South East Coordinates: " + position[1]);
	
	dataToTransmit = JSON.stringify(grids);
	console.log(dataToTransmit);
	url = "http://127.0.0.1/uav/gui/tercio.php";
	success = function() {
			console.log("Yay!");
		}
		
	$.ajax({
		type: "POST",
		url: url,
		data: 'points=' + dataToTransmit,
		success: success,
		dataType: "json",
		async: true
	});
	
	mark_grids_human_autonomous();
	//console.log(dataToTransmit);
});

$(document).on("click",".jarvis-imaging-2-no",function(){
	$('.jarvis').html('');
	map.disableKeyDragZoom();
	$('.water-probe').css('color', '#575757');
});

uavTracking = false;
$('.track-uav').click(function() {
	if( uavTracking ) {
		$('.track-uav').css('color', '#575757');
		uavTracking = false;
		track_uav();
	}
	else {
		$('.track-uav').css('color', '#fff');
		uavTracking = true;
	}
    if( typeof uavMarker !== "undefined") {
      uavMarker.setMap(null);
    }
});


$(document).ready(function() {
	refreshRate = 250;			// In milliseconds.
	setInterval(function() { 
					if (uavTracking) {
						track_uav();
						// track_uav() in-turn calls sensor_reading.
					}
				}, refreshRate);
});

count = -1;
readingsForHeatMap = Object();
function sensor_reading(coords) {
	count++;
	//console.log(count);
  
  readingsToTake = 16;    // How many readings to take before showing the heatmap.
	if (count == readingsToTake) {
		uavTracking = false;     // This stops tracking the UAV.
		console.log(readingsForHeatMap);
		
		send = Object();
		//send['values'] = readingsForHeatMap;
        
        readings = Object();
        count2 = 1;
        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                readings[i + ',' + j] = readingsForHeatMap[count2];
            }
            count2++;
        }
        console.log(readings);
		
		var heatmapURL = "http://127.0.0.1:5000/generate_heatmap?data=" + JSON.stringify(readings) + "&callback=safsaf";
        var data = $.ajax({
                type: "GET",
                url: heatmapURL,
                async: false,
                dataType: "jsonp"
            });
        
        setTimeout(function() {
            //reply = data.responseText;
            reply = 'heatmap.png?r=' + Math.random();
            
            source = "http://127.0.0.1/uav/gui/heatmaps/heatmap/app/modules/heatmaps/" + reply;
            var gaussianBounds = floorBounds;
            var overlayOptions = {
                                    opacity: 0.7
                                };
            gaussianOverlay = new google.maps.GroundOverlay(source, gaussianBounds, overlayOptions);
            gaussianOverlay.setMap(map);
        }, 1000);
       

		
	}
	
	
	var url = "http://127.0.0.1/uav/gui/bridge-sensor.php";

	var data = $.ajax({
					url:  url,
					dataType: "json", 
					async: false
				}); // This will wait until you get a response from the ajax request.
	
	sensorReading = data.responseText;
	sensorReading = JSON.parse(sensorReading);
	sensorReading = sensorReading['channel'][7];
	
	readingsForHeatMap[count] = sensorReading;
	
	// This gets new coords
	/*
	var url = "http://127.0.0.1/uav/gui/bridge.php";

	var data = $.ajax({
					url:  url,
					dataType: "json", 
					async: false
				}); // This will wait until you get a response from the ajax request.
	
	where = data.responseText;
	there = JSON.parse(where);
	
	coords = [there.translation.x, there.translation.y];
	*/
	
	
	$('.sensor-reading').html(sensorReading);
	
	if (typeof grids !== 'undefined') {
		water_sensing_color_tile(coords);	// Color the tiles.
	}
	
	sensor_reading_to_circles(coords, sensorReading); // Show circles.
}



flightPlanCoordinates = Array();
function track_uav() {
	
	if (uavTracking) {
		//console.log('tada!' + Math.random());
		
		
		/* This one's for receiving realtime data from Ben */
		//var url = "http://127.0.0.1/uav/gui/bridge.php";
		var url = "http://127.0.0.1/uav/gui/sensor-demo/position.php";

		var data = $.ajax({
						url:  url,
						dataType: "json", 
						async: false
					}); // This will wait until you get a response from the ajax request.
		
		where = data.responseText;
		there = JSON.parse(where);
		
		there = there.transform;
		
		coords = [there.translation.x, there.translation.y];
		console.log(coords);
		//console.log( [there.translation.x, there.translation.y, there.translation.z] );
		
		// We have the altitude as there.translation.z
		// Check if it's below a certain cutoff and color the tile only if the z-value is less than a certain value.
		altitudeCutoff = 0.14;
		if ( there.translation.z < altitudeCutoff ) {
			//console.log("Coloring...");
			sensor_reading(coords);
		}
		if (typeof uavMarker !== 'undefined') {
			uavMarker.setMap(null);
		}
		
		// Color the tile as well.
		// Not totally sure about the ordering. Do a trial run in Holodeck to confirm.
		
		uavMarker = new google.maps.Marker({
								position: new google.maps.LatLng(-coords[0], -coords[1]),		// The ordering is 1, 0. This is NOT a mistake.
								map: map,
								title: 'UAV',
								icon: 'http://127.0.0.1/uav/gui/images/icon.png'
						});
						
		newPoint  = new google.maps.LatLng(-coords[0], -coords[1]);						// The ordering is 1, 0. This is NOT a mistake.
		flightPlanCoordinates.push(newPoint);
		
		var flightPath = new google.maps.Polyline({
				path: flightPlanCoordinates,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 1
		});
		
		flightPath.setMap(map);
		uavMarker.setMap(map);
	}
	else {
    flightPath.setMap(null);
		uavMarker.setMap(null);
	}
}


var UAVMarker;
function placeMarker(location) {
  if ( UAVMarker ) {
	UAVMarker.setMap(map);		// Added later.
	UAVMarker.setPosition(location);
  } else {
	UAVMarker = new google.maps.Marker({
	  position: location,
	  map: map,
    icon: 'http://127.0.0.1/uav/gui/images/icon.png'
	});
  }
  position = [location['e'], location['d']];
  start_uav_jarvis(0, position);
}

listeningToUAVPosition = false;
$('.start-uav').click(function() {
	if( listeningToUAVPosition ) {
		listeningToUAVPosition = false;
		$('.start-uav').css('color', '#575757');
		start_uav_jarvis(1, 0);
	}
	else {
		listeningToUAVPosition = true;
		$('.start-uav').css('color', '#fff');
	}
	start_uav();
});


startUAVThrottle = false;
$('.start-uav-throttle').click(function() {
	if( ! startUAVThrottle ) {
		$('.start-uav-throttle').css('color', '#fff');
		start_uav_throttle_jarvis(0);
		startUAVThrottle = true;
	}
	else {
		startUAVThrottle = false;
		$('.start-uav-throttle').css('color', '#575757');
		start_uav_throttle_jarvis(-1);
	}
});

function start_uav_throttle_jarvis(level) {
	switch(level) {
		case 0:
		//$('.jarvis').html("Please enter a throttle amount.<br><br><input type='number' class='throttle-value' value='1000' min='1000' max='1100' style='width: 45px;'>&nbsp;&nbsp;&nbsp;<a class='big-red-button-uav-throttle'>Start</a>");
		var htmlContent = "Please enter a throttle amount.<br><br>";
		
		htmlContent += "<div style='width: 250px;'>";
		htmlContent += "<div style='float: left;'><input oninput='send_throttle_level();' type='range' class='throttle-value' value='1000' min='1000' max='1100' style='width: 150px;'></div>";
		htmlContent += "<div style='float: right;'><a class='big-red-button-uav-throttle'>Finish</a></div>";
		htmlContent += "</div>";
		
		htmlContent += "<div style='width: 200px;' class='row'>";
		htmlContent += "<div class='col-md-4'>Off</div>";
		htmlContent += "<div class='col-md-4'>Low</div>";
		htmlContent += "<div class='col-md-4'>High</div>";
		htmlContent += "</div>";
		$('.jarvis').html(htmlContent);
		
		break;
		
		case 1:
		$('.jarvis').html("UAV successfully dispatched!");
		break;
		
		case -1:
		$('.jarvis').html("");
		break;

	}
}


function send_throttle_level() {
	var throttle = $('.throttle-value').val();
	console.log(throttle);
	
	data = Object();
	data['throttle'] = throttle;
	
	// Send a POST request to get this data to TERCIO.
	url = "http://127.0.0.1/uav/gui/start-uav-throttle.php";
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		async: false,
		dataType: "json"
	});
}

$(document).on("click", ".big-red-button-uav-throttle", function() {
	$('.throttle-value').val(1000);
	$('.start-uav-throttle').trigger("click");
	//start_uav_throttle_jarvis(1);
});


function start_uav() {
	if (listeningToUAVPosition) {
		/* 
		 * Listen for click to get UAV hover position.
		 * Listen on the floorplan NOT on the map because the floorplan represents the bounds and the 
		 * user should not be able to select a region outside these bounds.
		 */
		google.maps.event.addListener(holodeckOverlay, 'click', function(event) {
														placeMarker(event.latLng);
													});
	}
	else {
		google.maps.event.clearListeners(holodeckOverlay, 'click');
		UAVMarker.setMap(null);
	}
}

$(document).on("click", ".uav-start-yes",function(){
	start_uav_jarvis(2, position);
	
	console.log("Starting UAV " + position);
	
	// Send a POST request with the location data.
	
	data = Object();
	data['waypoints'] = position;
	data = JSON.stringify(data);
	
	// Send a POST request to get this data to TERCIO.
	url = "http://127.0.0.1/uav/gui/start-uav.php";
	success = function() { }
	$.ajax({
		type: "POST",
		url: url,
		data: 'data=' + data,
		success: success,
		dataType: "jsonp"
	});
});

$(document).on("click",".uav-start-no",function(){
	start_uav_jarvis(1, 0);
});

function start_uav_jarvis(stage, position) {
	switch (stage) {
		
		case 0:
		$('.jarvis').html("Coordinates detected: <br>" + position[0] + ", " + position[1] + "<br><br>Are you sure?&nbsp;<span class='confirmation uav-start-yes'>Yes</span>&nbsp;/&nbsp;<span class='confirmation uav-start-no'>No</span>");
		break;
		
		case 1:
		$('.jarvis').html("");
		break;
		
		case 2:
		$('.jarvis').html("UAV Dispatched to the following coordinates!<br><br>(" + position[0] + ", " + position[1] + ")");
		break;
	}
}


function point_to_rectangle(position) {
	x = position[0];
	y = position[1];
	nw = [x - 1, y + 1];
	se = [x + 1, y - 1];
}

aerialImaging = false;
$('.imaging-area').click(function() {
	if ( ! aerialImaging ) {
		
		// TO DO: Need to erase all other drawings of rectangle before drawing a new one.
		
		map.disableKeyDragZoom();
		
		// Also, we don't want the screen to have the water sensing UAV grids. So clear that.
		// To do that set the boolean waterSensing = false and trigger $('.water-probe').click()
		waterSensing = true;
		$('.water-probe').trigger("click");
		
		$('.imaging-area').css('color', '#fff');
		aerialImaging = true;
		
		// Trigger an event to enable the user to drag a rectangle within the bounds.
		map.enableKeyDragZoom({
			noZoom: false,
			boxStyle: {border: "2px solid #736AFF"},
			visualEnabled: true,
			visualPosition: google.maps.ControlPosition.LEFT,
			visualPositionOffset: new google.maps.Size(35, 0),
			visualPositionIndex: null,
			visualSprite: "http://maps.gstatic.com/mapfiles/ftr/controls/dragzoom_btn.png",
			visualSize: new google.maps.Size(20, 20),
			visualTips: {
				 off: "Turn dragging On",
				 on:  "Turn dragging Off"
			}
		});
		var dz = map.getDragZoomObject();

		google.maps.event.addListener(dz, 'dragend', function(bnds) {
			nw = [ bnds['ia']['b'], bnds['ta']['b'] ];
			se = [ bnds['ia']['d'], bnds['ta']['d'] ];
			
			position = [nw, se];
			
			// Get the floor bounds to see if the user-drawn rectangle is out of bounds.
			var floorNW = [ floorBounds['ta']['d'], floorBounds['ta']['b'] ];
			var floorSE = [ floorBounds['ia']['d'], floorBounds['ia']['b'] ];
			
			if ((nw[0] < floorNW[0]) || (nw[1] > floorNW[1]) || (se[0] > floorSE[0]) || (se[1] < floorSE[1])){
				// Out of bounds.
				aerialImaging = true;
				$('.imaging-area').trigger("click");
				
			}
			else {
				// We have the position. Construct a new rectangle thing before sending this to TERCIO.
				aerial_imaging_jarvis(0, position);
			}
		});
		
	}
	else {
		$('.imaging-area').css('color', '#575757');
		aerialImaging = false;
		$('.jarvis').html("");
		map.disableKeyDragZoom();
	}
});


$(document).on("click",".aerial-imaging-yes",function(){
	oneRect = new Rectangle(position[0], position[1], true, 'A');
			
	data = new Object();
	
	data['width'] = 1;
	data['height'] = 1;
	data['points'] = oneRect;
	
	data = JSON.stringify(data);
	
	// Send a POST request to get this data to TERCIO.
	url = "http://127.0.0.1/uav/gui/tercio.php";
	success = function() {
			//console.log("Yay!");
			//aerial_imaging_jarvis(2, position);
		}
		
	$.ajax({
		type: "POST",
		url: url,
		data: 'points=' + data,
		success: success,
		dataType: "json",
		async: false
	});
	
	console.log("Yay!");
	aerial_imaging_jarvis(2, position);
});

$(document).on("click",".aerial-imaging-no",function(){
	aerial_imaging_jarvis(1, position);
});

function aerial_imaging_jarvis(stage, position) {
	switch (stage) {
		
		case 0:
		$('.jarvis').html("Coordinates detected: <br>" + position[0] + ", " + position[1] + "<br><br>Are you sure?&nbsp;<span class='confirmation aerial-imaging-yes'>Yes</span>&nbsp;/&nbsp;<span class='confirmation aerial-imaging-no'>No</span>");
		break;
		
		case 1:
		$('.jarvis').html("");
		break;
		
		case 2:
		$('.jarvis').html("UAV Dispatched to the following coordinates!<br><br>(" + position[0] + ", " + position[1] + ")");
		break;
	}
}


