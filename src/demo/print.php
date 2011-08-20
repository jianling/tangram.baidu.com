<?php
	$s = '\u72B6\u6001';
	var_dump(json_encodejson_encode($s));
	die();
    $str = $_REQUEST['code'] ;
    $str = str_replace("\\\"","\"",$str);
    $str = str_replace("\'","'",$str);
    $str = str_replace('\"','"',$str);
    echo $str;
?>