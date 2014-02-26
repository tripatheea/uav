<?php
	
	// This one's for sending POST requests with the selection (grid) data
	// to the Bwingle server so that Evie can query that one.
	
	$data = $_POST['points'];
	//$data = json_encode($data);
	//$data = json_decode($data);

	$url = Array('http://128.31.34.93:9090/TP/TP');
	
	//$myvars = array('points' => $data, 'api_key' => '6175007565');
	
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
