<!DOCTYPE html>
<html lang="en">
<head>
<title>Photos Directory</title>
<meta charset="utf-8">
</head>

<body>
<h2>Selected Images from Memorial Weekend 2020</h2>
<p>
Due to the Covid-19 pandemic the Lions Club, in a plan to
keep its members safe, raised 72 flags and 140 crosses along the
main entrance roadway. 
The Gary Waugh family and a few friends volunteered to set up
the remaining 131 flags and 143 crosses in a safe manner. 
All total there were 203 flags and 283 crosses.
</p>
<p>
A young man created a video to highlight Lamoni's Memorial Day tradition
of flags and crosses, including drone footage. Check it out on
<a href="https://www.youtube.com/watch?v=tOwdEr4187I" target="_blank">YouTube</a>.
</p>
<p>
These photos show some of the memorials and flags over Memorial Day 2020 weekend.
The first photo is the monument of the first burial at Rose Hill,
for Albert Dancer who died in 1881 during the local typhoid fever epidemic.
His mother, Rosalia Dancer, donated land for the oldest part of the cemetery 
and gave Rose Hill its name.
The second photo is the first veteran burial site,
for Captain John Godfrey who served in the Navy during the Civil War and died in 1894.
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
