<?php
	$x = mt_rand(0, 300.6522257702209595) / 100;
	$y = mt_rand(0, 400.889600753195714) / 100;
	$z = mt_rand(0, 50)/10;
	
	$data = Array();
	$data['transform'] = Array();
	$data['transform']['translation'] = Array();
	$data['transform']['translation']['x'] = $x;
	$data['transform']['translation']['y'] = $y;
	$data['transform']['translation']['z'] = $z;
	
	echo json_encode($data);
?>
