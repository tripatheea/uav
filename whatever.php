<?php
	
	$data = $_POST['points'];
	//$data = json_encode($data);
	//$data = json_decode($data);
	
	

	$url = 'http://www.bwingle.org/scl/';
	
	
	/*
	$data = get_object_vars($data);

	
	$myvars = http_build_query($data) . "\n";
	$myvars = http_build_query($data, '', '&amp;');
	*/
	$myvars = array('points' => $data);
	
	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec( $ch );
	echo $response;
