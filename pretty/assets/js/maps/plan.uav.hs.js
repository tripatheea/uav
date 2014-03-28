planUAVHSTracking = false;
$('.plan-uav-hs').click(function(){
  if ( ! planUAVHSTracking) {
    // Not tracking before this but the user just clicked on track.
    planUAVHSTracking = true;
    var refreshRate = 250;      // In milliseconds.
    setInterval(function() { 
        if (planUAVHSTracking) {
          plan_uav_hs();
          // plan_uav_hs() in-turn calls sensor_reading.
        }
      }, refreshRate);
  }
  else {
    planUAVHSTracking = false;
    planUAVHSflightPath.setMap(null);
    planUAVHSMarker.setMap(null);
  }
  
});

planUAVHSCount = 0;
planUAVHSflightPlanCoordinates = Array();
function plan_uav_hs() {

  if (planUAVHSCount == 23) {
    planUAVHSTracking = false;
  }

  if (planUAVHSTracking) {
    /* This one's for receiving realtime data from Ben */
    //var url = "http://127.0.0.1/uav/gui/bridge.php";
    var url = "http://127.0.0.1/uav/gui/sensor-demo/uav.hs.plan.php";

    var data = $.ajax({
            url:  url,
            dataType: "json", 
            async: false
          }); // This will wait until you get a response from the ajax request.
    
    var where = data.responseText;
    var there = JSON.parse(where);
    var there = there.transform;
    
    if (there.count == planUAVHSCount) {
      planUAVHSCount++;
      var coords = vicon_to_gui_offset_fix(there.translation.x, there.translation.y);
      if (typeof planUAVHSMarker !== 'undefined') {
        planUAVHSMarker.setMap(null);
      }
      
      planUAVHSMarker = new google.maps.Marker({
                  position: new google.maps.LatLng(coords[0], coords[1]),   
                  map: map,
                  title: 'UAV',
                  icon: 'http://127.0.0.1/uav/gui/images/icon.png'
              });
              
      var newPoint  = new google.maps.LatLng(coords[0], coords[1]);
      planUAVHSflightPlanCoordinates.push(newPoint);
      
      var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 1
      };

      planUAVHSflightPath = new google.maps.Polyline({
        path: planUAVHSflightPlanCoordinates,
        strokeOpacity: 0,
        icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
               }],
        map: map
      });
      planUAVHSflightPath.setMap(map);
      planUAVHSMarker.setMap(map);
    }
  }
}

