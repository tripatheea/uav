<?php
	
	// This one's for sending POST requests with the selection (grid) data
	// to the Bwingle server so that Evie can query that one.
	
	$data = $_POST['points'];
	//$data = json_encode($data);
	//$data = json_decode($data);

	$url = 'http://www.bwingle.org/scl/';
	$url = "http://128.31.34.191:8080/UAV/TURC";
	
	//$myvars = array('points' => $data);
	$myvars = array('points' => $data, 'api_key' => '6175007565');
	
	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec( $ch );
	echo $response;
