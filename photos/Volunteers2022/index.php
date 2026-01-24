<!DOCTYPE html>
<html lang="en">
<head>
<title>Make A Difference Day Volunteers 2022</title>
<meta charset="utf-8">
<style>
   figure {
      display: inline-block;
      margin: 0 0 1em 0;
   }
   figcaption {
      text-align: center;
      vertical-align: top;
   }
</style>
</head>

<body>
<h2>Make a Difference Day Volunteers at Rose Hill</h2>
<p>
On Saturday, October 22, 2022, Lamoni volunteers participated in the annual
Make A Difference Day from 9 a.m. to noon. Eight wrestlers from the 
Graceland University Wrestling Team came to cut and remove large tree limbs
from the cemetery, under the direction of Board President Kelly Everett. 
They removed 11 large pickup truckloads of logs and branches to the city brush dump.
</p>
<p>
A group of 10 kids and 6 adults from the Methodist Church came to help with
other tasks under the direction of Board Secretary and Sexton Jim Jones.
In the first hour they swept through the cemetery to clear it of ground decorations
and debris, filling 6 large industrial strength lawn and leaf bags.
They spent the rest of the morning cleaning the oldest headstones to scrape away
moss and scrub them with soapy water. At least 35 headstones were cleaned.
</p>

<h3>Video of kids cleaning headstones (double-click for full screen view)</h3>
<?php

$files = scandir('.');
sort($files);
foreach($files as $file){
   if (strcasecmp(substr($file,strlen($file)-4), ".mp4")===0 ){
      $caption = substr($file, 3, -4);          // remove first 3 and last 4 characters from the filename
      $caption = str_replace("_"," ",$caption); // replace the underscores in filename with spaces

      print('<figure>'."\n");
      print('   <video controls="controls" width="600" xxheight="175"\n       name="'.$file.'" src="'.$file.'"></video>');
      print('   <figcaption>'.$caption.'</figcaption>'."\n");
      print('</figure>'."\n");

   }
}

?>

<h3>Photos (click any of these to see enlarged view)</h3>
<?php

$files = scandir('.');
sort($files);
foreach($files as $file){
   if (strcasecmp(substr($file,strlen($file)-4), ".jpg")===0 ){
      $caption = substr($file, 3, -4);          // remove first 3 and last 4 characters from the filename
      $caption = str_replace("_"," ",$caption); // replace the underscores in filename with spaces
      print('<figure>'."\n");
      print('   <a href="'.$file.'" target="_blank"><img src="'.$file.'" alt="_" title="'.$caption.'" height="300"></a>'."\n");
      print('   <figcaption>'.$caption.'</figcaption>'."\n");
      print('</figure>'."\n");
   }
}

?>


<br><br><br>


</body>
</html>
