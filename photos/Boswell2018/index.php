<!DOCTYPE html>
<html lang="en">
<head>
<title>Congressman Boswell and Wife Burial</title>
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
<h2>Graveside Photos of Congressman Boswell Burial</h2>
<p>
Some photos taken before, during, and after the Graveside service for 
Congressman Leonard Boswell and wife Dody on Saturday, August 25, 2018.
U.S. Flags were set up at Rose Hill by the Lamoni Lions Club.
Full Military Honors were rendered by the Iowa National Guard.
Blackhawk Helicoptors flew over to honor Boswell's service in Vietnam 
as a helicopter pilot. A flyover in Leonard Boswell's plane was done by
Jordan Omstead, who grew up in Lamoni and is a City Councilman,
Airport Manager, and an Air Force veteran. His admission into the Air Force 
Academy was made possible by a recommendation by family friend and 
Congressman Boswell.
See also posted photos by the Iowa National Guard and media 
photographers by following the links below:
</p>
<ul>
<li>
   <a href="https://www.flickr.com/photos/ianationalguard/sets/72157699034430741"
      target="_blank">
      Iowa National Guard photos
   </a>
</li>
<li>
   <a href="https://www.desmoinesregister.com/story/news/politics/2018/08/25/leonard-boswell-dody-boswell-joint-funeral-graceland-university-scott-orth-tom-harkin-kim-reynolds/1084377002/"
      target="_blank">
      Des Moines Register photos
   </a>
</li>
<li>
   <a href="https://whotv.com/2018/08/25/leonard-and-dody-boswell-remembered-in-lamoni-congressman-buried-with-full-military-honors/"
      target="_blank">
      WHO TV news segment
   </a>
</li>
</ul>

<?php

$files = scandir('.');
sort($files);
foreach($files as $file){
   if (strcasecmp(substr($file,strlen($file)-4), ".jpg")===0 ){
      $caption = substr($file, 3, -4);          // remove first 3 and last 4 characters from the filename
      $caption = str_replace("_"," ",$caption); // replace the underscores in filename with spaces
      print('<figure>'."\n");
      print('   <a href="'.$file.'" target="_blank"><img src="'.$file.'" alt="_" title="'.$caption.'" height="200"></a>'."\n");
      print('   <figcaption>'.$caption.'</figcaption>'."\n");
      print('</figure>'."\n");
   }
}

?>

<h3>Videos</h3>
<?php

$files = scandir('.');
sort($files);
foreach($files as $file){
   if (strcasecmp(substr($file,strlen($file)-4), ".mp4")===0 ){
      $caption = substr($file, 3, -4);          // remove first 3 and last 4 characters from the filename
      $caption = str_replace("_"," ",$caption); // replace the underscores in filename with spaces

      print('<figure>'."\n");
      print('   <video controls="controls" width="400" xxheight="175"\n       name="'.$file.'" src="'.$file.'"></video>');
      print('   <figcaption>'.$caption.'</figcaption>'."\n");
      print('</figure>'."\n");

   }
}

?>
<br><br><br>


</body>
</html>
