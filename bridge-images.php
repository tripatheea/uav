<?php
	// This one's for receiving UAV position and sensor data from Ben's server.

	$url = "http://192.168.20.183:8000/tile";
	
	/* gets the data from a URL */
	function get_data($url) {
		$ch = curl_init();
		$timeout = 5;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}
	
	
	$data = get_data($url);
	
  $data = '[1341414,["-1.7,-0.6", "0.1,-1.1", "-1.9,-0.2", "-2.0,-1.5", "-1.4,-0.6", "-1.9,-1.2", "-0.1,-0.5", "-0.5,-1.3", "0.3,0.2", "-0.3,-0.4", "-0.2,-0.5", "-1.4,-1.1", "-0.1,-0.2", "-1.3,-0.7", "-0.4,-0.8", "-0.5,-0.3", "0.2,-0.3", "-0.4,-0.3", "0.2,-0.1", "0.1,-1.5", "0.1,0.2", "-1.0,-0.7", "-1.4,-1.5", "-1.8,-0.9", "-0.7,-1.3", "-1.5,0.0", "-0.2,-1.1", "-1.5,-1.2", "-1.1,-0.9", "-0.8,-0.5", "-0.9,-0.8", "-0.2,0.1", "-2.0,0.1", "-1.0,-1.4", "-0.3,-0.6", "-1.5,0.1", "-2.0,-1.0", "-0.5,-0.7", "-1.1,-1.1", "0.2,-0.7", "-0.7,-0.7", "-1.3,-0.3", "-0.6,-1.3", "-1.5,-0.4", "-1.0,-1.1", "-1.7,-0.5", "-1.9,-1.1", "-0.4,-1.3", "-1.3,-1.4", "0.0,-0.7", "-0.7,-0.9", "-1.7,-0.7", "-0.2,-0.9", "-1.7,-1.0", "-1.0,-0.8", "-1.4,-1.0", "-1.5,-0.3", "-1.9,0.0", "-0.7,-0.2", "0.1,0.0", "0.2,-0.6", "0.3,-0.3", "0.3,-0.6", "-1.7,-1.4", "-0.1,-0.9", "-0.9,-0.9", "-2.0,-0.1", "-0.6,0.2", "0.1,-0.7", "-1.1,-0.3", "-0.4,0.2", "-1.0,0.2", "-0.5,-0.9", "-0.1,-0.4", "-1.2,-0.4", "-1.1,-0.7", "-1.5,-1.1", "0.3,-1.5", "0.1,-1.3", "-1.2,-1.3", "-0.3,-1.0", "0.0,-1.3", "-1.2,-0.6", "-1.9,-0.6", "-0.3,-0.8", "0.0,0.1", "-0.7,-0.6", "-0.1,-0.1", "-0.4,-0.7", "0.1,-0.6", "0.3,-0.9", "-0.1,0.1", "-0.1,-1.5", "-1.0,-0.9", "-0.5,-0.6", "-0.8,-1.1", "0.3,-0.1", "-0.8,-0.7", "-0.2,-0.4", "-0.8,-0.1", "-2.0,-1.3", "-0.4,-1.0", "-1.7,0.2", "-0.2,-1.0", "-1.1,-1.0", "-1.6,-1.2", "0.2,-1.0", "0.3,-1.4", "-1.1,-0.2", "0.3,-1.1", "-0.2,-0.6", "-1.8,-0.8", "-1.2,-1.0", "-1.8,0.0", "-1.0,-0.1", "0.0,-1.2", "-2.0,-1.2", "-1.5,-0.8", "-1.6,-0.7", "-1.0,-1.3", "0.0,-0.1", "0.1,-1.2", "-0.4,-1.5", "-2.0,-0.9", "-0.8,-0.8", "-1.3,-1.5", "0.3,0.1", "-0.6,-0.1", "-1.4,-0.3", "-0.4,-1.2", "-0.6,-0.6", "-1.5,-1.3", "0.0,-0.3", "-0.6,-0.5", "0.0,-0.6", "-0.6,0.0", "0.3,-1.2", "-1.3,-1.3", "0.2,-0.5", "-1.2,-1.4", "-1.2,0.0", "-0.5,-0.4", "-0.9,-0.3", "0.2,0.0", "0.2,0.2", "-1.3,-1.0", "-0.3,-0.5", "-0.9,-1.0", "-1.9,-1.5", "-1.8,-0.2", "-1.5,-0.9", "-0.8,-0.6", "-1.4,-0.4", "-1.0,-0.6", "-0.1,-0.6", "-1.6,-0.4", "-1.9,-0.8", "-1.7,-0.2", "0.2,0.1", "-1.4,-0.8", "0.1,-0.1", "-0.8,-0.9", "0.3,0.0", "-1.1,-0.8", "-1.0,-1.5", "-1.4,-1.3", "-0.6,-1.2", "-1.6,-0.5", "-1.0,-1.0", "-2.0,-0.6", "0.2,-1.1", "-0.2,-1.5", "-1.6,0.1", "-0.9,-0.2", "-1.6,-1.1", "-1.4,-0.7", "-0.1,-1.0", "-1.8,-1.4", "0.2,-1.4", "-0.9,0.0", "-0.3,-1.3", "-0.3,0.2", "-1.2,-0.8", "-0.3,-1.2", "-1.7,0.0", "-0.3,-1.4", "-1.8,0.2", "-0.1,-0.8", "-1.6,-1.0", "-0.9,-1.1", "-1.9,-1.3", "-1.7,-0.4", "-0.2,-0.7", "-0.8,-0.4", "-2.0,-0.2", "-1.1,-0.6", "-0.1,-0.7", "-0.9,-0.4", "0.3,-0.8", "-0.3,0.0", "-0.2,-0.3", "-0.7,-0.5", "-2.0,-0.7", "-1.0,-0.4", "-1.3,-0.1", "-0.3,-0.3", "-1.3,0.1", "-1.6,0.0", "-0.5,-0.8", "-0.4,-0.1", "-0.7,0.2", "-0.6,-1.4", "-1.7,-1.1", "0.2,-1.2", "-1.8,-0.7", "-1.3,-1.1", "-0.6,-0.9", "-1.8,-0.1", "-0.4,0.1", "-1.9,-1.4", "-0.3,0.1", "-1.9,0.2", "-1.0,0.1", "-0.5,-0.1", "-0.3,-1.1", "-0.7,-1.2", "-0.1,-1.2", "-1.6,-1.5", "0.1,-0.8", "-1.8,-1.0", "-1.2,-1.1", "-0.4,-0.6", "-1.6,0.2", "-1.7,-0.3", "-0.4,-1.1", "-0.2,-0.1", "-1.2,-1.5", "-1.6,-0.6", "0.3,-0.4", "-1.1,-0.4", "-0.9,-1.3", "-1.2,-0.3", "-0.7,-0.8", "-0.2,-0.2", "-1.3,-0.2", "-2.0,-1.1", "-1.0,-0.3", "0.0,0.0", "-0.3,-0.7", "-1.3,-0.8", "0.2,-0.8", "-1.3,0.0", "-1.9,0.1", "-0.9,-1.2", "-0.1,0.2", "0.0,-0.4", "-1.9,-0.9", "-0.1,-0.3", "-0.5,-1.1", "-0.4,-0.9", "-1.3,-0.5", "-1.8,-0.5", "-0.2,-1.4", "-0.7,-1.4", "0.0,-1.4", "0.1,-0.3", "-0.7,0.1", "-0.5,0.0", "-1.5,-0.1", "-0.8,-0.3", "-1.4,0.1", "-1.9,-0.1", "-0.8,0.0", "0.1,-0.5", "-0.6,-1.1", "-1.9,-1.0", "0.0,0.2", "-1.2,-0.7", "0.1,-0.9", "0.3,-0.5", "-0.2,0.2", "-2.0,-0.4", "-0.8,-0.2", "-0.9,-1.4", "-0.7,-1.0", "-1.4,0.2", "-1.5,0.2", "-1.1,0.0", "-0.8,-1.2", "-1.7,-1.2", "-1.5,-0.2", "-0.8,-1.5", "-1.1,-1.2", "-1.1,-0.1", "-0.1,-1.4", "-0.9,-0.1", "-0.4,-0.2", "-1.1,-1.5", "-0.2,-1.2", "-1.5,-0.6", "-0.7,0.0", "-1.4,0.0", "-0.8,-1.4", "-1.1,-1.4", "-1.8,-0.4", "-0.5,-1.4", "-1.6,-0.3", "-0.5,-0.2", "-0.9,-1.5", "-1.5,-1.5", "-1.4,-0.2", "-0.9,0.1", "0.2,-0.9", "-1.5,-0.5", "-0.5,-1.2", "0.1,-0.2", "-1.6,-1.3", "-0.7,-0.1", "-1.4,-0.9", "-0.3,-0.9", "-1.2,0.1", "0.3,-1.3", "-0.6,-0.2", "-0.4,-0.5", "-1.7,-0.1", "-2.0,-0.8", "-0.6,-0.7", "-2.0,0.2", "0.3,-0.7", "-1.1,0.1", "-1.0,-0.5", "-0.6,-1.5", "0.1,-1.4", "-1.1,0.2", "0.0,-0.5", "-0.4,-0.4", "-1.2,-0.5", "-1.7,-1.5", "0.2,-1.3", "-0.3,-1.5", "-0.2,-0.8", "-1.8,-1.2", "-1.6,-0.9", "-0.7,-0.4", "0.0,-1.0", "-0.1,-1.3", "-1.3,-0.6", "0.0,-1.1", "-0.8,0.1", "-1.9,-0.3", "-0.3,-0.1", "-0.5,-0.5", "-1.6,-1.4", "-0.6,-0.3", "0.1,-1.0", "-1.2,-0.2", "-0.5,-1.0", "0.0,-1.5", "-0.5,0.2", "-0.9,-0.5", "-1.0,0.0", "-2.0,0.0", "-1.4,-0.1", "-1.4,-1.2", "0.2,-0.2", "-0.6,0.1", "-0.6,-0.8", "-1.8,-1.1", "0.3,-1.0", "-1.6,-0.1", "0.2,-1.5", "-1.1,-1.3", "-0.9,-0.7", "0.3,-0.2", "-0.5,0.1", "-1.2,-1.2", "-1.8,0.1", "-1.3,-0.9", "-0.6,-1.0", "-0.5,-1.5", "-1.5,-0.7", "-2.0,-0.3", "0.1,0.1", "0.0,-0.9", "-1.2,0.2", "0.1,-0.4", "-1.0,-0.2", "-1.9,-0.5", "-0.3,-0.2", "-0.6,-0.4", "-0.2,-1.3", "-1.7,-0.9", "-1.6,-0.2", "-0.8,-1.0", "0.0,-0.2", "-1.4,-0.5", "-0.1,-1.1", "-1.7,-0.8", "-0.9,0.2", "-1.7,-1.3", "-0.7,-0.3", "-0.4,-1.4", "-1.8,-0.6", "-0.1,0.0", "-1.8,-1.5", "-1.3,0.2", "-1.1,-0.5", "-1.5,-1.0", "-1.0,-1.2", "-1.7,0.1", "-1.9,-0.7", "-1.9,-0.4", "-0.7,-1.1", "-1.8,-0.3", "-1.2,-0.9", "-1.5,-1.4", "-1.6,-0.8", "-0.2,0.0", "-1.8,-1.3", "-1.3,-1.2", "-1.3,-0.4", "-1.2,-0.1", "-1.4,-1.4", "-0.8,-1.3", "-0.7,-1.5", "-2.0,-1.4", "-0.8,0.2", "0.0,-0.8", "0.2,-0.4", "-0.4,0.0", "-0.9,-0.6", "-2.0,-0.5"]]';
  
  
	echo $data;
