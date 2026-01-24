<!DOCTYPE html>
<html lang="en">
<head>
<title>Photos Directory</title>
<meta charset="utf-8">
<style>
   a {
     font-family: Arial, Sans-Serif;
     font-size: 9pt;
     line-height: 16pt;
	 margin-left: 10px;
   }
</style>

</head>

<body>
<?php

$files = scandir('.');
sort($files);
foreach($files as $file){
   if($file != "." && $file != ".." && $file != "index.php"){
      echo'<a href="'.$file.'">'.$file.'</a> <br>'."\n";
   }
}

?>

</body>
</html>



