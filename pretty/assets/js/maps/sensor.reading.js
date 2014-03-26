
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
    water_sensing_color_tile(coords); // Color the tiles.
  }
  
  sensor_reading_to_circles(coords, sensorReading); // Show circles.
}

function water_sensing_color_tile(coords) {
  
  var tileCoords = point_to_tile(coords);
  var color = 'rgb(' + sensorReading + ', 0, 0)';
  
  var hyphenIndex = tileCoords[0] + '-' + tileCoords[1];
  var commaIndex = tileCoords[0] + ',' + tileCoords[1];
  var selector = "." + hyphenIndex;
  
  var arg = 'color|' + color;
  grids['points'][commaIndex]['action'] = Array('color', color);
  $(selector).trigger( "click" );
  
  
}

/*
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
* 
*/

function sensor_reading_to_circles(position, reading) { //position, color
  
  var circle = {};
  circle = {
    center: new google.maps.LatLng(position[0], position[1]),
    value: reading
  };
  

  var color = 'rgb(0, ' + sensorReading + ', 0)';
  
  var circleOptions = {
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: color,
    fillOpacity: 0.7,
    zIndex: 999,
    map: map,
    center: circle.center,
    radius: circle.value * 50
  };
  // Add the circle for this city to the map.
  sensorCircle = new google.maps.Circle(circleOptions);
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