<?php
    $str = $_REQUEST['code'] ;
    $str = str_replace("\\\"","\"",$str);
    $str = str_replace("\'","'",$str);
    $str = str_replace('\"','"',$str);
    echo $str;
?>