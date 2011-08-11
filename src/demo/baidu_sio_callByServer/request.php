<?php
	echo 'var responseName = "tom";';
	if(isset($_GET['callback']))
		echo $_GET['callback'].'()';
?>