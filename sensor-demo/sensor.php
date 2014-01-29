<?php
	$x = mt_rand(0, 255);
	
	$data = Array();
	$data['channel'] = Array(0, 0, 0, 0, 0, 0, 0, $x);
	echo json_encode($data);
?>
