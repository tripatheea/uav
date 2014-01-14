<?php
	error_reporting(E_ALL);

	$data = $_POST['info'];
	$data = mysql_real_escape_string($data);

	
	require_once('connection.php');

	
	$sql = "INSERT INTO tracking_text (text) VALUES ('$data')";
    
  
	if($conn->query($sql) === false) {
			trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR);
	}
	



