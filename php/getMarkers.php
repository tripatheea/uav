<?php
	error_reporting(-1);
	
	require_once('connection.php');

	
	$sql = "SELECT text FROM tracking_text ORDER BY timestamp DESC";

	$rs = $conn->query($sql);

	if($rs === false) {
			//trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR);
	}
	
	$rs->data_seek(0);
	
	$data = $rs->fetch_assoc();
	$allStuff = explode(';', $data['text']);
	
	$everything = Array();
	foreach	($allStuff as $stuff) {
		$datum = explode(',', $stuff);
		$info['latitude']  = $datum[0];
		$info['longitude'] = $datum[1];
		$info['text']      = $datum[2];
		$everything[] = $info;
	}

	
	echo json_encode($everything);
