		function get_all_tiles() {
			var width = 0.1;
			var height = 0.1;
			
			var baseImgURL = 'http://127.0.0.1/uav/gui/smile/tiles/';
			var url = 'http://127.0.0.1/uav/gui/smile/tiles-list.html';
			var data = $.ajax({
						url:  url,
						dataType: "json", 
						async: false
					}); // This will wait until you get a response from the ajax request.
			
			list = data.responseText.split(';');
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
			}
			return tiles;
		}
		
		function prepare_overlay() {
			tiles = get_all_tiles();
			
			overlays = [];
			for (i = 0; i < tiles.length; i++) {
				tile = tiles[i];
				
				var nw = [ -tile['coordinates']['nw'][0], -tile['coordinates']['nw'][1] ]; 
				var se = [ -tile['coordinates']['se'][0], -tile['coordinates']['se'][1] ]; 
				
				console.log(nw + '');
				console.log(se + '\n');
	
				var imgURL = tile['path'];
                                
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
				overlay = new google.maps.GroundOverlay(imgURL, imageBounds);
				//overlays.push(overlay);
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
		
		
		function overlay_magic() {
			overlays = prepare_overlay();
                       
            
                        /*
			for (i = 0; i < overlays.length; i++) {
				overlays[i].setMap(map);
			}
			console.log('Fetching new tiles.');
                        */
		}
