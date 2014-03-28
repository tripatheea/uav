
uavHSTrackUAV = false;
$('.launch-uav-hs').click(function(){
  if ( ! uavHSTrackUAV) {
    // Not tracking before this but the user just clicked on track.
    uavHSTrackUAV = true;
    var refreshRate = 250;      // In milliseconds.
    setInterval(function() { 
        if (uavHSTrackUAV) {
          track_uav_hs();
        }
      }, refreshRate);
  }
  else {
    uavHSTrackUAV = false;
    track_uav_hs();
  }
  
});

trackUAVHSflightPlanCoordinates = Array();
function track_uav_hs() {

  if (uavHSTrackUAV) {
    /* This one's for receiving realtime data from Ben */
    //var url = "http://127.0.0.1/uav/gui/bridge.php";
    var url = "http://127.0.0.1/uav/gui/sensor-demo/uav.hs.track.php";

    var data = $.ajax({
            url:  url,
            dataType: "json", 
            async: false
          }); // This will wait until you get a response from the ajax request.
    
    var where = data.responseText;
    var there = JSON.parse(where);

    
    var coords = vicon_to_gui_offset_fix(there.transform.translation.x, there.transform.translation.y);
    var detection = there.bool;
    
    gridIndex = point_to_tile(coords);
    if ( 0 <= gridIndex[0] && gridIndex[0] <= 3 && 0 <= gridIndex[1] && gridIndex[1] <= 3) {
      hs_detection(coords, detection);
    }

    if (typeof trackUAVHSMarker !== 'undefined') {
      trackUAVHSMarker.setMap(null);
    }
    
    trackUAVHSMarker = new google.maps.Marker({
                position: new google.maps.LatLng(coords[0], coords[1]),   
                map: map,
                title: 'UAV',
                icon: 'http://127.0.0.1/uav/gui/images/icon.png'
            });
            
    var newPoint  = new google.maps.LatLng(coords[0], coords[1]);

    trackUAVHSflightPlanCoordinates.push(newPoint);
    
    trackUAVHSFlightPath = new google.maps.Polyline({
      path: trackUAVHSflightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 1,
      map: map
    });
    
    trackUAVHSFlightPath.setMap(map);
    trackUAVHSMarker.setMap(map);
  }
  else {
    if (typeof trackUAVHSMarker !== 'undefined') {
      trackUAVHSMarker.setMap(null);
    }
    if (typeof trackUAVHSFlightPath !== 'undefined') {
      trackUAVHSFlightPath.setMap(null);
    }
  }

}

