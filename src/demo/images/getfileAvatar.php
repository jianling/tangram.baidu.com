<?php
	//var_dump($_FILES["uploadDataField"]);
	
	echo file_put_contents('test.txt',json_encode($_POST), LOCK_EX);
	die();
if ( ($_FILES["file"]["size"] < 20000) && $_FILES["uploadDataField"] )
{
	$filename = $_FILES["uploadDataField"]["name"];
	$out['code'] = 0;
	$out['filename'] = $filename;
	$out['des'] = $_POST["aaa"];
	$out['path'] = "upload/test.png";
	move_uploaded_file($_FILES["uploadDataField"]["tmp_name"], "upload/test.png" );
}
else{
	$out['error'] = 1;
	$out['info'] = 'Invalid file';
}
echo json_encode($out);
file_put_contents('test.txt', json_encode($out), LOCK_EX);
?>
