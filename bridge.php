<?php
	// This one's for receiving UAV position and sensor data from Ben's server.


  $url = "http://127.0.0.1/uav/gui/sensor-demo/position.php";
  
	//$url = "http://192.168.20.183:8000/vicon/UAV_CHRIS";		// OR UAV_ROGER
	//$url = "http://192.168.20.183:8000/vicon/UAV_ROGER";		// OR UAV_CHRIS
	
	
  $data = "";
  
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
	
	echo $data;
