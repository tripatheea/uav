<?php

	$data = $_POST;
	
	//$url = 'http://192.168.20.183:8000/throttle';
	//$url = 'http://bwingle.org/scl/waypoint.php';
	
	$url = Array('http://192.168.20.183:8000/throttle');
	
	$myvars = $data;
	
	
	foreach ($url as $u) {
		$ch = curl_init( $u );
		curl_setopt( $ch, CURLOPT_POST, 1);
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt( $ch, CURLOPT_HEADER, 0);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

		$response = curl_exec( $ch );
		echo $response;
	}

?>
