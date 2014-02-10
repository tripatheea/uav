<?php

$data = $_POST['values'];

$readings = Array();
$count = 1;
for($i = 0; $i < 4; $i++) {
    for($j = 0; $j < 4; $j++) {
        $readings[$i . ',' . $j] = $data[$count];
    }
    $count++;
}

$abc = json_encode($readings);

$file = 'readings.json';
file_put_contents($file, $abc);

$output = shell_exec('./abc.sh');
echo "<pre>".$output."</pre>";



?>
