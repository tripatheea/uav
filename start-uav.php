<?php
	
	$data = $_POST;
	
	
	$url = "http://192.168.20.183:8000/waypoint";
	
	//$url = "http://bwingle.org/scl/waypoint.php";
	
	//$myvars = array('throttle' => 1000);
	
	$myvars = $data;
	
	
	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec( $ch );
	echo $response;
		

?>
