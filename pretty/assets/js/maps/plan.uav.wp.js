planUAVWPTracking = false;
$('.plan-uav-wp').click(function(){
  if ( ! planUAVWPTracking) {
    // Not tracking before this but the user just clicked on track.
    planUAVWPTracking = true;
    var refreshRate = 250;      // In milliseconds.
    setInterval(function() { 
        if (planUAVWPTracking) {
          plan_uav_wp();
          // plan_uav_wp() in-turn calls sensor_reading.
        }
      }, refreshRate);
  }
  else {
    planUAVWPTracking = false;
    planUAVWPflightPath.setMap(null);
    planUAVWPMarker.setMap(null);
  }
  
});

planUAVWPCount = 0;
planUAVWPflightPlanCoordinates = Array();
function plan_uav_wp() {

  if (planUAVWPCount == 23) {
    planUAVWPTracking = false;
  }

  if (planUAVWPTracking) {
    /* This one's for receiving realtime data from Ben */
    //var url = "http://127.0.0.1/uav/gui/bridge.php";
    var url = "http://127.0.0.1/uav/gui/sensor-demo/uav.wp.plan.php";

    var data = $.ajax({
            url:  url,
            dataType: "json", 
            async: false
          }); // This will wait until you get a response from the ajax request.
    
    var where = data.responseText;
    var there = JSON.parse(where);
    var there = there.transform;
    
    if (there.count == planUAVWPCount) {
      planUAVWPCount++;
      var coords = vicon_to_gui_offset_fix(there.translation.x, there.translation.y);
      if (typeof planUAVWPMarker !== 'undefined') {
        planUAVWPMarker.setMap(null);
      }
      
      planUAVWPMarker = new google.maps.Marker({
                  position: new google.maps.LatLng(coords[0], coords[1]),   
                  map: map,
                  title: 'UAV',
                  icon: 'http://127.0.0.1/uav/gui/images/icon.png'
              });
              
      var newPoint  = new google.maps.LatLng(coords[0], coords[1]);
      planUAVWPflightPlanCoordinates.push(newPoint);
      
      var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 1
      };

      planUAVWPflightPath = new google.maps.Polyline({
        path: planUAVWPflightPlanCoordinates,
        strokeOpacity: 0,
        icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
               }],
        map: map
      });
      planUAVWPflightPath.setMap(map);
      planUAVWPMarker.setMap(map);
    }
  }
}

