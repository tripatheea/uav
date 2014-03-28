<?php
 //  session_start();
    
	// $x = mt_rand(0, 365.22257702209595) / 100;
	// $y = mt_rand(0, 488.9600753195714) / 100;
	// $z = mt_rand(0, 50)/10;
    
    
 //  $allX = Array(-3.9990234375, -3.01025390625, -1.724853515625, -0.3955078125, -0.626220703125, -2.04345703125, -3.076171875, -4.1748046875, -4.097900390625, -3.218994140625, -1.91162109375, -0.823974609375, -0.582275390625, -1.944580078125, -2.9443359375, -4.7021484375 );
 //  $allY = Array(-0.3515602939922709, -0.4724067568442764, -0.2746571512146894,  -0.5602938041720732, -1.3292264529974207, -1.263325357489324, -1.4280747713669428, -1.1864386394452024, -2.1088986592431254, -2.3943223575350774,  -2.416275654706373, -2.317483068758292, -2.997898741103044, -2.9759559359447554, -3.1405161039832357, -3.5024553022772564);
    
 //    if( ! isset($_SESSION['count'])) {
 //        $_SESSION['count'] = 0;
 //    }
    
 //    if($_SESSION['count'] >= count($allX)) {
 //        $_SESSION['count'] = 0;
 //    }
    
    
 //    $count = $_SESSION['count'];
    
	// $data = Array();
	// $data['transform'] = Array();
	// $data['transform']['translation'] = Array();
	// $data['transform']['translation']['x'] = -$allY[$count];
	// $data['transform']['translation']['y'] = -$allX[$_SESSION['count']];
	// $data['transform']['translation']['z'] = 0.1;
	
    
 //  $_SESSION['count'] = $count + 1;
    
    
	// echo json_encode($data);

session_start();
$prerecordedFlight = Array(
                            '0' => Array('x' => -1.1653649838677018, 'y' => -5.077392578125, 'z' => 0.0907 ), 
                            '1' => Array('x' => -2.252511367184471, 'y' => -4.5830078125, 'z' => 0.1067 ), 
                            '2' => Array('x' => -3.273038737834352, 'y' => -3.561279296875, 'z' => 0.0467 ),
                            '3' => Array('x' => -4.98239623134401, 'y' => -2.133056640625, 'z' => 0.0672 ), 
                            '4' => Array('x' => -3.9857132159055055, 'y' => -1.254150390625, 'z' => 0.9533 ),
                            '5' => Array('x' => -2.9219904175897335, 'y' => -1.034423828125, 'z' => 0.2601 ), 
                            '6' => Array('x' => -2.109792614667179, 'y' => -0.529052734375, 'z' => 0.8184 ), 
                            '7' => Array('x' => -0.4293573399297591, 'y' => -0.594970703125, 'z' => 0.9534 ), 
                            '8' => Array('x' => 0.603342334476109, 'y' => -1.35302734375, 'z' => 0.1425 ),
                            '9' => Array('x' => 0.2957349846486456, 'y' => -3.220703125, 'z' => 0.6441 ), 
                            '10' => Array('x' => 0.1309412619427971, 'y' => -4.5390625, 'z' => 0.3098 ), 
                            '11' => Array('x' => -0.9237061081240417, 'y' => -4.681884765625, 'z' => 0.6979 ), 
                            '12' => Array('x' => -1.1653649838677018, 'y' => -5.077392578125, 'z' => 0.0907 )
                            );

if( ! isset($_SESSION['count'])) {
    $_SESSION['count'] = 0;
}

if($_SESSION['count'] >= count($prerecordedFlight)) {
    $_SESSION['count'] = 0;
}


$count = $_SESSION['count'];
  
$data = Array();
$data['transform'] = Array();
$data['transform']['translation'] = Array();
$data['transform']['translation']['x'] = - ( $prerecordedFlight[$_SESSION['count']]['x'] - 0.005 );
$data['transform']['translation']['y'] = - ( $prerecordedFlight[$_SESSION['count']]['y'] - 1.41 );
$data['transform']['translation']['z'] = - $prerecordedFlight[$_SESSION['count']]['z'];
$data['transform']['count'] = $count;
  
$_SESSION['count'] = $count + 1;
  
  
echo json_encode($data);



?>
