<!DOCTYPE html>
<html lang="en">
<head>
<title>Photos Directory</title>
<meta charset="utf-8">
</head>

<body>
<h2>Selected Images from Memorial Weekend 2018</h2>
<p>
A collection of photos, to show some of
the decorated memorials and flags at Lamoni Rose Hill.
</p>
<?php

$files = scandir('.');
sort($files);
foreach($files as $file){
   if (strcasecmp(substr($file,strlen($file)-4), ".jpg")===0 )
      print('<a href="'.$file.'" target="_blank"><img src="'.$file.'" alt="_" height="200"></a> ');
}

?>

</body>
</html>
