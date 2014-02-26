		function get_all_tiles() {
			var width = 1;
			var height = 1;
                                                
      var url = "http://127.0.0.1/uav/gui/bridge-images.php";
      var baseImgURL = 'http://127.0.0.1/uav/gui/smile/tiles/';
      //var baseImgURL = 'http://192.168.20.183:8000/static/tiles/';

			$.ajax({
						url:  url,
						dataType: "json", 
						async: true,
            success: function() { return collect_tiles(); }
					}); // This will wait until you get a response from the ajax request.
          
          function collect_tiles() {               
            //list = data.responseText.split(';');
            list = JSON.parse(data.responseText);
            lastUpdateMarker  = "ASDADADD";
            updateMarker = list[0];
            list = list[1];
            
            if( typeof lastUpdateMarker !== 'undefined') {
              console.log("Current: " + updateMarker + "\nLast: " + lastUpdateMarker);
            }
            
            if ((typeof lastUpdateMarker === 'undefined' ) || ( updateMarker != lastUpdateMarker)) {
              // Fresh images. Load them all.
                    
              //console.log("I'm loading new tiles. :D");
              
              // Remove the first element because it's a Boolean describing whether there's new data to fetch or not.
              list.shift();
              tiles = [];
              for (i = 0; i < list.length; i++) {
                tile = Object();
                tile['coordinates'] = Object();
                
                
                var coords = list[i].split(',');
                //console.log(coords);
                coords[0] = coords[0].trim();
                coords[1] = coords[1].split('.');
                
                coords[1] = coords[1][0] + '.' + coords[1][1];
                
                
                tile['coordinates']['nw'] = [coords[0], coords[1]];
                tile['coordinates']['se'] = [parseFloat(coords[0]) + width, parseFloat(coords[1]) - height];
                
                tile['path'] 		= baseImgURL + tile['coordinates']['nw'][0] + ',' + tile['coordinates']['nw'][1] + '.png';

                // The above path to URL loads the cached image. But I want it to be reloaded from server every time a request is made.
                //console.log(tile['path']);
                tiles.push(tile);
                
                lastUpdateMarker = updateMarker;
              }
              return tiles;
            }
            else {
              // Images haven't been updated. 
              return false;
            }
          }
		}
		
		function prepare_overlay() {
      // Get the promise.
      var allTiles = get_all_tiles();
      
      allTiles.success(function(data) {
        console.log(data);
      }
      
			//tiles = get_all_tiles();
			
      if ( tiles ) {
        //console.log("Loading fresh images!");
        overlays = [];
        for (i = 0; i < tiles.length; i++) {
          tile = tiles[i];
          
          var nw = [ -tile['coordinates']['nw'][0], -tile['coordinates']['nw'][1] ]; 
          var se = [ -tile['coordinates']['se'][0], -tile['coordinates']['se'][1] ]; 
          
          //console.log(nw + '');
          //console.log(se + '\n');

          var imgURL = tile['path'] + "?r=";
          //var imgURL = tile['path'] + "?r=" + Math.random();
          
          //console.log(imgURL);
          
          var imageBounds = new google.maps.LatLngBounds(
                                                            new google.maps.LatLng(nw[1], se[0]),
                                                            new google.maps.LatLng(se[1], nw[0])
                                                  );
          /*
          var imageBounds = new google.maps.LatLngBounds(
                                                            new google.maps.LatLng(se[0], nw[1]),
                                                            new google.maps.LatLng(nw[0], se[1])
                                                  );
          */
          overlay = new google.maps.GroundOverlay(imgURL, imageBounds,  { zIndex: 10 });
          overlays.push(overlay);
          
          overlay.setMap(map);
          
          /*
          var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(nw[0], nw[1]),
                  map: map,
                  title: 'Hello World!'
          });
          var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(se[0], se[1]),
                  map: map,
                  title: 'Hello World!'
          });
          */
                
        }

        return overlays; 
      }
      else {
        // Images haven't been updated yet. Do nothing.
        return false;
      }
		}
		
		
		function overlay_magic() {
      overlays = prepare_overlay();
      
      /*
      var refreshRate = 1000; // In milliseconds
      setInterval(function(){
              console.log("I'm not sleeping, alright?");
              get_and_tile_images();                        
      }, refreshRate );
      */
		}
                
    function get_and_tile_images() {
      overlays = prepare_overlay();
    }
