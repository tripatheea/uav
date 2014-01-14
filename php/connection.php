<?php
	
	error_reporting(E_ALL);
	$host = 'localhost';
	$database = 'uav';
	$username = 'uavala2A';
	$password = 'kaikAI*I$MKDAOI)@956239FOIAF';
	
	$conn = new mysqli($host, $username, $password, $database);

	// check connection
	if ($conn->connect_error) {
			trigger_error('Database connection failed: '  . $conn->connect_error, E_USER_ERROR);
	}
	

