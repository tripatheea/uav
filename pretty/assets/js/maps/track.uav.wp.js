
trackUAVWPTracking = false;
$('.launch-uav-wp').click(function(){

  if ( ! trackUAVWPTracking) {
    // Not tracking before this but the user just clicked on track.
    trackUAVWPTracking = true;
    var refreshRate = 250;      // In milliseconds.
    setInterval(function() { 
        if (trackUAVWPTracking) {
          track_uav_wp();
          // track_uav_wp() in-turn calls sensor_reading.
        }
      }, refreshRate);
  }
  else {
    trackUAVWPTracking = false;
    track_uav_wp();
  }
  
});

trackUAVWPflightPlanCoordinates = Array();
function track_uav_wp() {

  if (trackUAVWPTracking) {
    /* This one's for receiving realtime data from Ben */
    //var url = "http://127.0.0.1/uav/gui/bridge.php";
    var url = "http://127.0.0.1/uav/gui/sensor-demo/position.php";

    var data = $.ajax({
            url:  url,
            dataType: "json", 
            async: false
          }); // This will wait until you get a response from the ajax request.
    
    where = data.responseText;
    console.log(where);
    there = JSON.parse(where);
    
    there = there.transform;
    
    coords = vicon_to_gui_offset_fix(there.translation.x, there.translation.y);
    console.log(coords);
    
    //console.log( [there.translation.x, there.translation.y, there.translation.z] );
    
    // We have the altitude as there.translation.z
    // Check if it's below a certain cutoff and color the tile only if the z-value is less than a certain value.
    altitudeCutoff = 0.14;
    if ( there.translation.z < altitudeCutoff ) {
      //console.log("Coloring...");
      sensor_reading(coords);
    }
    if (typeof trackUAVWPMarker !== 'undefined') {
      trackUAVWPMarker.setMap(null);
    }
    
    trackUAVWPMarker = new google.maps.Marker({
                position: new google.maps.LatLng(coords[0], coords[1]),   
                map: map,
                title: 'UAV',
                icon: 'http://127.0.0.1/uav/gui/images/icon.png'
            });
            
    var newPoint  = new google.maps.LatLng(coords[0], coords[1]);


    trackUAVWPflightPlanCoordinates.push(newPoint);
    

    var lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 1
    };


    trackUAVWPflightPath = new google.maps.Polyline({
      path: trackUAVWPflightPlanCoordinates,
      strokeOpacity: 0,
      icons: [{
              icon: lineSymbol,
              offset: '0',
              repeat: '20px'
             }],
      map: map
    });
    
    trackUAVWPflightPath.setMap(map);
    trackUAVWPMarker.setMap(map);
  }
  else {
    if (typeof trackUAVWPMarker !== 'undefined') {
      trackUAVWPMarker.setMap(null);
    }
    if (typeof trackUAVWPflightPath !== 'undefined') {
      trackUAVWPflightPath.setMap(null);
    }
  }

}

